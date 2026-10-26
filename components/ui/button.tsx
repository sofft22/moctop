import Link from "next/link";
import { forwardRef, ReactNode } from "react";
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps {
  href?: string;
  children?: ReactNode;
  variant?: "primary" | "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, children, variant = "primary", onClick, className, disabled, type = "button", size }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300";

    const styles: Record<string, string> = {
      primary: "bg-mock-pink text-white hover:bg-mock-pink/90 shadow-md hover:shadow-lg",
      outline: "border border-mock-gold text-mock-dark hover:bg-mock-gold/10",
    };

    const variantClass = styles[variant] ?? buttonVariants({ variant: variant as any, size: size as any });

    const combinedClassName = className
      ? `${className}`
      : `${base} ${variantClass}`;

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} onClick={onClick} className={combinedClassName} disabled={disabled}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
