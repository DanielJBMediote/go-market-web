"use client";

import { Button } from "@/components/ui/button";
import { useAuthentication } from "@/contexts/auth-provider";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInForm } from "./form";

export default function SignIn() {
  const { userContext } = useAuthentication();
  const router = useRouter();

  console.log(userContext);

  return (
    <div className="space-y-4 h-full">
      <header className="flex justify-between">
        <div className="flex gap-2 items-center">
          <ShoppingBag />
          <span className="text-xl text-foreground font-bold">Go Market</span>
        </div>
        <Link href="/auth/sign-up">
          <Button variant="link" className="cursor-pointer text-foreground">
            Sing Up
          </Button>
        </Link>
      </header>
      <div className="flex  flex-col h-full items-center space-y-4">
        <div className="text-center mt-20">
          <h1 className="text-3xl text-foreground font-bold">Welcome Back!</h1>
          <p className="text-sm text-foreground">
            Sign in to access your account or create a new one.
          </p>
        </div>
        {userContext ? (
          <div className="flex flex-col justify-center max-w-xl gap-2">
            <p className="text-sm font-medium text-foreground">Enter with your logged account:</p>
            <Link href="/dashboard">
              <div className="border rounded bg-secondary hover:bg-primary hover:text-secondary py-2 px-4 flex gap-0.5 items-center justify-center text-foreground transition-colors delay-75">
                <User />
                <p>{userContext.username}</p>
              </div>
            </Link>
          </div>
        ) : (
          <SignInForm />
        )}
      </div>
    </div>
  );
}
