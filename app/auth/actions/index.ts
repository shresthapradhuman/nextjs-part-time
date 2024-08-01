"use server";

import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/schemas";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { isWithinExpirationDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import createPasswordResetToken from "../helper/createPasswordResetToken";
import { sendPasswordResetEmail } from "../helper/sendPasswordResetEmail";

export async function register(
  credentials: z.infer<typeof registerSchema>,
): Promise<{ error: string }> {
  try {
    /** check fields validation */
    const validatedFields = registerSchema.safeParse(credentials);

    /** return error response for invalid fields */
    if (!validatedFields.success) {
      return { error: "Invalid data." };
    }

    /* destructure validated fields */
    const { fullname, email, password } = validatedFields.data;

    /** check user with email and username exist or not */
    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    /** return error response for user already exist  */
    if (existingUser) {
      return { error: "User with email already exist." };
    }

    /* hash password using argon2 */
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    /* generate the userid */
    const userId = generateIdFromEntropySize(10);

    /** create user */
    await prisma.user.create({
      data: {
        id: userId,
        fullname,
        email,
        passwordHash,
      },
    });

    /** create session */
    const session = await lucia.createSession(userId, {});

    /** create session cookie */
    const sessionCookie = lucia.createSessionCookie(session.id);

    /** set cookies */
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    /** redirect to home page */
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function login(
  credentials: z.infer<typeof loginSchema>,
): Promise<{ error: string }> {
  try {
    /** check fields validation */
    const validatedFields = loginSchema.safeParse(credentials);

    /** return error response for invalid fields */
    if (!validatedFields.success) {
      return { error: "Invalid data." };
    }

    /* destructure validated fields */
    const { email, password } = validatedFields.data;

    /** check user with email exist or not */
    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    /** return error response for user not exist  */
    if (!existingUser || !existingUser.passwordHash) {
      return { error: "Wrong username and password combination." };
    }

    /* compare password */
    const isPasswordMatch = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    /** return error response for password not match */
    if (!isPasswordMatch) {
      return { error: "Wrong username and password combination." };
    }

    /** create session */
    const session = await lucia.createSession(existingUser.id, {});

    /** create session cookie */
    const sessionCookie = lucia.createSessionCookie(session.id);

    /** set cookies */
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    /** redirect to home page */
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Please try again. " };
  }
}

export async function logout() {
  /* check session validation */
  const { session } = await validateRequest();

  /* return error response for unauthorized user */
  if (!session) {
    throw new Error("Unauthorized");
  }

  /* invalidate session */
  await lucia.invalidateSession(session.id);

  /* create a new blank session cookie */
  const sessionCookie = lucia.createBlankSessionCookie();

  /* set cookies */
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  /* redirect to login page */
  return redirect("/auth/login");
}

export async function forgotPassword(
  credentials: z.infer<typeof forgotPasswordSchema>,
): Promise<{ error?: string; success?: string }> {
  try {
    /** check fields validation */
    const validatedFields = forgotPasswordSchema.safeParse(credentials);

    /** return error response for invalid fields */
    if (!validatedFields.success) {
      return { error: "Invalid data." };
    }

    /* destructure validated fields */
    const { email } = validatedFields.data;
    /** check user with email exist or not */
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" },
      },
    });

    /** return error response for user not exist  */
    if (!user) {
      return { error: "User not found." };
    }

    /** create a password reset token */
    const tokenId = await createPasswordResetToken(user.id);

    /** send email with password reset link */
    await sendPasswordResetEmail(user.email, tokenId, user.fullname || "");

    return {
      success: "Password reset link has been sent. Please confirm your email.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function resetPassword(
  credentials: z.infer<typeof resetPasswordSchema>,
  verificationToken: string,
): Promise<{ error?: string; success?: string }> {
  try {
    /** check fields validation */
    const validatedFields = resetPasswordSchema.safeParse(credentials);

    /** return error response for invalid fields */
    if (!validatedFields.success) {
      return { error: "Invalid data." };
    }

    /* destructure validated fields */
    const { password } = validatedFields.data;

    /** check token hash */
    const token_hash = encodeHex(
      await sha256(new TextEncoder().encode(verificationToken)),
    );
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        token_hash,
      },
    });
    if (!token || !isWithinExpirationDate(token.expires_at)) {
      return { error: "Invalid Token" };
    }
    await prisma.passwordResetToken.delete({
      where: {
        token_hash,
      },
    });
    await lucia.invalidateUserSessions(token.userId);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await prisma.user.update({
      where: {
        id: token.userId,
      },
      data: {
        passwordHash,
      },
    });
    return {
      success: "Password reset has been successfully done.",
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong. Please try again." };
  }
}
