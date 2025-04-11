import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const textVariants = cva("transition-colors", {
  variants: {
    variant: {
      title: "text-3xl font-bold text-primary",
      subtitle: "text-xl font-semibold text-secondary",
      paragraph: "text-base font-normal text-foreground",
      span: "text-sm font-medium text-muted-foreground",
      flag: "text-xs font-medium text-muted",
    },
    weight: {
      normal: "",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    size: {
      base: "",
      sm: "text-sm",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      foreground: "text-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "paragraph",
    weight: "normal",
    size: "base",
    color: "foreground",
  },
});

interface TextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof textVariants> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  ({ className, variant, size, weight, color, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant, size, weight, color }), className)}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";

export { Text, textVariants };
