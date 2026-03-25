import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const anchorVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-primary/80 dark:hover:text-white/80 dark:text-white",
  {
    variants: {
      variant: {
        default: "text-primary underline-offset-4 hover:underline",
        destructive: "text-destructive hover:text-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "text-secondary-foreground hover:text-secondary/80",
        ghost: "hover:text-accent-foreground",
        muted: "text-muted-foreground hover:text-foreground",
      },
      size: {
        default: "px-0",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof anchorVariants> & {
    asChild?: boolean
  }

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        className={cn(anchorVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Anchor.displayName = "Anchor"

export { Anchor, anchorVariants }
