import { Metadata } from "next";
import Image from "next/image";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Go Market | Auth",
  description: "Another e-commerce website.",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="inset-0 h-screen flex bg-background max-lg:justify-center max-lg:items-center max-lg:bg-secondary max-lg:p-10">
      <Image
        src="/main-image.svg"
        alt=""
        width={920}
        height={100}
        priority
        className="max-lg:hidden"
      />
      <div className="bg-background shadow w-2/3 p-10">{children}</div>
    </div>
  );
}
