import Image from "next/image";
import Link from "next/link";
import React from "react";
import ResetPasswordForm from "../_components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1">
            <h1 className="text-3xl font-medium">Reset Password?</h1>
            <p className="text-muted-foreground">
              Enter new password to update your profile.
            </p>
          </div>
          <div className="space-y-5">
            <ResetPasswordForm />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <div className="block text-center text-muted-foreground">
              Remember your password ? Go back to{" "}
              <Link
                href={"/auth/login"}
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={"/assets/reset-password.jpg"}
          alt="login-bg"
          priority
          width={800}
          height={800}
          className="hidden w-1/2 md:block"
        />
      </div>
    </main>
  );
};

export default ResetPasswordPage;
