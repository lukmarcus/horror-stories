import React from "react";
import "./Button.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={`button button--${variant} button--${size}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
