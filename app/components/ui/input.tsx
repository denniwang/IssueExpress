import React from "react";

// Remove empty interface or add properties
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={className} {...props} />;
  }
);
Input.displayName = "Input";
