import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-charcoal text-ivory hover:bg-charcoal-light border border-charcoal",
  secondary:
    "bg-champagne text-charcoal hover:bg-champagne-dark border border-champagne",
  outline:
    "bg-transparent text-charcoal border border-charcoal/30 hover:border-champagne hover:text-champagne-dark",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1FB855] border border-[#25D366]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-sm",
  md: "px-7 py-3.5 text-sm",
  lg: "px-9 py-4 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-body font-medium tracking-wide transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonBaseProps {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonBaseProps {}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";
