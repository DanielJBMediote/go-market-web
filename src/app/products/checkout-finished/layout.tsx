import { Header } from "@/components/header";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Go Market | Checkout Finished",
  description: "Checkout finished.",
};

export default function ProductLayout({ children }: PropsWithChildren) {
  return (
    <div className="space-y-6">
      <Header />
      <div className="px-6 py-3">{children}</div>
    </div>
  );
}
