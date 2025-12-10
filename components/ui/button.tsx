import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "white" | "destructive";
    size?: "default" | "sm" | "lg" | "xl" | "icon";
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "btn-primary text-white",
            secondary: "btn-secondary text-gray-700",
            outline: "bg-transparent border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary hover:bg-blue-50/50 transition-all",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all",
            link: "bg-transparent text-primary hover:text-primary-dark underline-offset-4 hover:underline p-0 h-auto",
            white: "bg-white text-gray-900 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all",
            destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md transition-all",
        };

        const sizes = {
            default: "h-12 px-6 py-2 text-sm",
            sm: "h-10 px-4 py-1.5 text-sm",
            lg: "h-14 px-8 py-3 text-base",
            xl: "h-16 px-10 py-4 text-lg",
            icon: "h-12 w-12 p-0",
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
