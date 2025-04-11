"use client";

import { HeroicInfo } from "@/components/heroic-info";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 justify-center">
      <HeroicInfo />
      <div className="flex gap-2 place-self-center">
        <Link href="/client/dashboard">
          <Button>Start Shopping</Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button>Create an Account</Button>
        </Link>
      </div>
    </div>
  );
}
