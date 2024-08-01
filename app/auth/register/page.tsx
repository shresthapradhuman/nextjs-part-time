import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RegisterForm from "../_components/RegisterForm";

export const metadata: Metadata = {
  title: "Register Page",
  description: "Register to access the app.",
};

const RegisterPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10  p-10 md:w-1/2">
          <div className="space-y-1">
            <h1 className="text-3xl font-medium">Register Part Time</h1>
            <p className="text-muted-foreground">
              Enter your details to create an account.
            </p>
          </div>
          <div className="h-full space-y-5">
            <RegisterForm />
            <div className="block text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={"/auth/login"}
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={"/assets/register.jpg"}
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

export default RegisterPage;
