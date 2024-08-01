import { TimeSpan, createDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";

const createPasswordResetToken = async (userId: string): Promise<string> => {
  /** token exist or not  */
  const tokenExist = await prisma.passwordResetToken.findMany({
    where: {
      userId,
    },
  });

  if (tokenExist) {
    /** check reset token exist or not. if exist delete the reset token with that user id */
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
      },
    });
  }
  /** generate a  token */
  const tokenId = generateIdFromEntropySize(25); // 40 character
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  /** create a reset token */
  await prisma.passwordResetToken.create({
    data: {
      token_hash: tokenHash,
      userId,
      expires_at: createDate(new TimeSpan(2, "h")),
    },
  });
  return tokenId;
};

export default createPasswordResetToken;
