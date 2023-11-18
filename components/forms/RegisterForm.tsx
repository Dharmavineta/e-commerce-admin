"use client";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Ring } from "@uiball/loaders";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Eye, Github } from "lucide-react";
import { PasswordInput } from "../PasswordInput";
import { Separator } from "../ui/separator";

const registerFormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be more than 3 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be more than 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be more than 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type registerFormType = z.infer<typeof registerFormSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<registerFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onRegister = async (values: registerFormType) => {
    try {
      const res = await axios.post("/api/register", values);
      if (res.status === 201) {
        toast.success(
          "Hurray! You're a part of our community now! Login to access your account"
        );
        router.push("/login");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data);
      } else {
        toast.error(
          "Oops, something went wrong, please try again sometime later"
        );
      }
    }
  };
  return (
    <div>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <CardTitle className="text-lg">Register</CardTitle>
          <CardDescription className="text-muted-foreground ">
            Choose your preferred registration method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            <Button className="w-full" variant={"outline"}>
              <FcGoogle className="w-4 h-4 mr-2" />
              Google
            </Button>
          </div>
          <div className="relative mt-3 mb-3">
            <div className="absolute inset-0 flex items-center ">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground uppercase">
              <span className="bg-background px-2">Or Continue with</span>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onRegister)}
              className="flex flex-col gap-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your official name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      We never share emails with anybody
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} placeholder="xxxxxxxxxx" />
                      </FormControl>
                      <FormDescription>
                        Password must be more than 6 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} placeholder="xxxxxxxxxx" />
                      </FormControl>
                      <FormDescription>
                        Re-enter your password please
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant={"secondary"}
                className=" mt-4 w-full bg-sky-500 text-white hover:bg-sky-600"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? <Ring color="white" size={25} /> : <>Register</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
