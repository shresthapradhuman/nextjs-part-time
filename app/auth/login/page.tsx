import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import LoginForm from "../_components/LoginForm";
import SocialLoginButton from "../_components/SocialLoginButton";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login to access the app.",
};

const LoginPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1">
            <h1 className="text-3xl font-medium">Welcome to Part Time !</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access the{" "}
              <span className="text-sm font-semibold text-primary">
                Part Time
              </span>{" "}
              Job information.
            </p>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <div className="block text-center text-muted-foreground">
              Doesn&apos;t have an account?{" "}
              <Link
                href={"/auth/register"}
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <SocialLoginButton />
          </div>
        </div>
        <Image
          src={"/assets/login.jpg"}
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

export default LoginPage;
