import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label
                        className="text-sm font-semibold text-gray-700 block"
                        htmlFor={props.id}
                    >
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "input-field flex h-14 w-full rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-red-400 focus:border-red-500 focus:shadow-red-500/10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
