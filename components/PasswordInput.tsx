import React, { useState } from "react";
import { Input, InputProps } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);
    return (
      <div className="relative">
        <Input
          type={showPass ? "text" : "password"}
          className={cn(className)}
          ref={ref}
          {...props}
        />
        <Button
          size={"icon"}
          variant={"ghost"}
          type="button"
          className="absolute right-2 top-0 h-full py-1 hover:bg-transparent"
          onClick={() => setShowPass((prev) => !prev)}
        >
          {showPass ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
