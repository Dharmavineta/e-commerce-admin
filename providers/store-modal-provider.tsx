"use client";
import StoreModal from "@/components/modals/StoreModal";
import React, { useEffect, useState } from "react";

const StoreModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return <StoreModal />;
};

export default StoreModalProvider;
