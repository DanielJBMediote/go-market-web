"use client";

import { IAxiosErr } from "@/api";
import { Roles, UserInstanceApi } from "@/api/UserApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { ShoppingBag, Store, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signUpSchema = z.object({
  username: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Roles),
});

type SignUpType = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(signUpSchema),
  });

  async function handleSignUp(data: SignUpType) {
    try {
      const { name, email, password, username, role } = data;
      const response = await UserInstanceApi.create({
        name,
        email,
        password,
        username,
        role,
      });

      if (response.status == 201) {
        toast.success("User created successfully!", {
          action: {
            onClick: () => {
              router.push("/auth/sign-in");
            },
            label: "Sign In",
          },
        });
      }
    } catch (error) {
      const err = error as IAxiosErr;
      toast.error(err.message);
      console.error(error);
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-between">
        <div className="flex gap-2 items-center">
          <ShoppingBag />
          <span className="text-xl text-foreground font-bold">Go Market</span>
        </div>
        <Link href="/auth/sign-in">
          <Button variant="link" className="cursor-pointer text-foreground">
            Sing In
          </Button>
        </Link>
      </header>
      <div className="justify-center items-center space-y-4">
        <div className="text-center place-self-center mt-20 space-y-2 max-w-xs">
          <h1 className="text-3xl text-foreground font-bold">Sign Up for Go Market</h1>
          <p className="text-sm text-foreground">
            Create an account to start shopping or manage your orders, and receive exclusive offers.
          </p>
        </div>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSignUp)}
            className="grid grid-cols-3 w-2/3 place-self-center space-y-4"
          >
            <FormItem className="col-span-3">
              <FormLabel className="text-sm text-foreground" htmlFor="name">
                Name
              </FormLabel>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...methods.register("name")}
              />
            </FormItem>
            <FormMessage>{methods.getFieldState("username").error?.message}</FormMessage>
            <FormItem className="col-span-3">
              <FormLabel className="text-sm text-foreground" htmlFor="username">
                Username
              </FormLabel>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...methods.register("username")}
              />
            </FormItem>
            <FormMessage>{methods.getFieldState("username").error?.message}</FormMessage>
            <FormItem className="col-span-3">
              <FormLabel className="text-sm text-foreground" htmlFor="email">
                E-mail
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Enter your e-mail"
                {...methods.register("email")}
              />
            </FormItem>
            <FormMessage>{methods.getFieldState("email").error?.message}</FormMessage>
            <FormItem className="col-span-3">
              <FormLabel className="text-sm text-foreground" htmlFor="password">
                Password
              </FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password here"
                {...methods.register("password")}
              />
            </FormItem>
            <FormField
              control={methods.control}
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center justify-center"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="client" className="hidden" />
                        </FormControl>
                        <FormLabel
                          data-state={field.value == Roles.CLIENT ? "active" : "disabled"}
                          className="py-3 px-8 border cursor-pointer data-[state=active]:text-white data-[state=active]:bg-primary rounded text-foreground"
                        >
                          <User />
                          Client
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="manager" />
                        </FormControl>
                        <FormLabel
                          data-state={field.value == Roles.MANAGER ? "active" : "disabled"}
                          className="py-3 px-8 border cursor-pointer data-[state=active]:text-white data-[state=active]:bg-primary rounded text-foreground"
                        >
                          <Store />
                          Manager
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="col-span-3"
              disabled={methods.formState.isSubmitting}
              isLoading={methods.formState.isSubmitting}
            >
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
