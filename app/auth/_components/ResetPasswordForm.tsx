"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/loading-button";
import { resetPasswordSchema } from "@/schemas";
import { resetPassword } from "../actions";
import { toast } from "@/components/ui/use-toast";
import { PasswordInput } from "@/components/password-input";
import { useRouter, useSearchParams } from "next/navigation";

type FormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const form = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: FormData) => {
    startTransition(async () => {
      const { error, success } = await resetPassword(values, token!);
      if (error) {
        toast({
          variant: "destructive",
          description: error,
        });
      }
      if (success) {
        toast({
          description: success,
          className: "bg-green-500 text-white",
        });
      }
      router.push("/auth/login");
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="text-base font-normal text-inherit"
                >
                  New Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="eg: New password"
                    {...field}
                    id={field.name}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="text-base font-normal text-inherit"
                >
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="eg: Confirm password"
                    {...field}
                    id={field.name}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
