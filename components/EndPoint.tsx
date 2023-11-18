"use client";

import React, { FC } from "react";
import { Badge, BadgeProps } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

type props = {
  title: string;
  description: string;
  variant: "public" | "admin";
};

const textMap: Record<props["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<props["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

const EndPoint: FC<props> = ({ description, title, variant = "public" }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("End point copied successfully!");
  };
  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle>
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-betwee">
        <code className="relative rounded bg-muted">{description}</code>
        <Button
          onClick={handleCopy}
          className=""
          variant={"outline"}
          size={"icon"}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EndPoint;
