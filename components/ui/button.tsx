import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui Button, themed to the GymSpot design language:
 * bold uppercase labels, rounded-xl corners, a primary-green glow on hover.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-black uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:brightness-110 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-white/5 text-foreground border border-white/10 hover:bg-white/10 hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-primary/40 text-primary bg-transparent hover:bg-primary/10 hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "text-foreground/70 hover:text-primary hover:bg-white/5",
      },
      size: {
        sm: "h-9 px-4 text-[11px]",
        md: "h-11 px-6 text-xs",
        lg: "h-13 px-8 text-sm [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
