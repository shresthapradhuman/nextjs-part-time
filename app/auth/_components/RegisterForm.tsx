"use client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { register } from "../actions";
import { PasswordInput } from "@/components/password-input";
import LoadingButton from "@/components/loading-button";
import { registerSchema } from "@/schemas";

type FormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: FormData) => {
    startTransition(async () => {
      const { error } = await register(values);
      if (error) {
        toast({
          variant: "destructive",
          title: "Registeration Failed Error",
          description: error,
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <FormField
            name="fullname"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="text-base font-normal text-inherit"
                >
                  FullName
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="eg: John Doe"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="text-base font-normal text-inherit"
                >
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="eg: *******"
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
          Register
        </LoadingButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
