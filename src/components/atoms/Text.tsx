import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "small" | "large" | "muted";
}

export function Text({ className, variant = "body", children, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "text-foreground",
        {
          "text-base": variant === "body",
          "text-sm": variant === "small",
          "text-lg": variant === "large",
          "text-muted-foreground text-sm": variant === "muted",
        },
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
