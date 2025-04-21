import { Header } from "@/components/header";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Go Market | Cupons",
  description: "Create your cupons.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="space-y-6">
      <Header />
      <div className="px-4 space-y-2">{children}</div>
    </div>
  );
}
