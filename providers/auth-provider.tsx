"use client";
import React, { FC } from "react";
import { SessionProvider } from "next-auth/react";

type props = {
  children: React.ReactNode;
};

const AuthProvider: FC<props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
