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
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import { forgotPasswordSchema } from "@/schemas";
import { forgotPassword } from "../actions";
import { toast } from "@/components/ui/use-toast";

type FormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values: FormData) => {
    startTransition(async () => {
      const { error, success } = await forgotPassword(values);
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
      form.reset();
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="text-base font-normal text-inherit"
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    id={field.name}
                    placeholder="eg: john@example.com"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton loading={isPending} type="submit" className="w-full">
          Send Reset Link
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
