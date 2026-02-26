import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 shadow-sm rounded-xl [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "btn-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-transparent shadow-md",
        outline:
          "border border-white/10 bg-black/20 hover:bg-white/10 text-white backdrop-blur-md",
        secondary: 
          "bg-white/10 text-white hover:bg-white/20 border border-white/5 backdrop-blur-md",
        ghost: 
          "hover:bg-white/10 text-muted-foreground hover:text-white shadow-none",
        link: 
          "text-purple-electric underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-12 px-6 py-2 w-full sm:w-auto", // md size mapped to default for backward compatibility
        sm: "h-9 px-4 text-xs rounded-lg w-auto",
        lg: "h-14 px-8 rounded-2xl w-full sm:w-auto text-base",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
