"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <Button
      onClick={() => signOut()}
      variant={"link"}
      className="text-muted-foreground"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
