import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const loadingVariant = cva("rounded-full border-b animate-spin border-primary", {
  variants: {
    size: {
      "x-small": "w-3 h-3",
      small: "w-5 h-5",
      medium: "w-7 h-7",
      large: "w-9 h-9",
      "x-large": "w-12 h-12",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface LoadingProps {
  label?: string;
}

export function Loading({
  label = "Loading...",
  size,
  className,
}: React.ComponentProps<"div"> & LoadingProps & VariantProps<typeof loadingVariant>) {
  return (
    <div
      className={cn(
        "flex justify-center items-center gap-2 text-xl text-muted-foreground",
        className
      )}
    >
      <div className={cn(loadingVariant({ size }))} />
      {label}
    </div>
  );
}
