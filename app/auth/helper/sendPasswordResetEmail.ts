import { resend } from "@/lib/resend";
import ResetPasswordEmail from "../templates/ResetPasswordEmail";

const domain = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name?: string,
) {
  const confirmLink = `${domain}/auth/reset-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({ resetPasswordLink: confirmLink, name }),
  });
}
