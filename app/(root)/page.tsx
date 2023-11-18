"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import React, { useEffect } from "react";

const StartPage = () => {
  const { isOpen, onClose, onOpen } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);
  return null;
};

export default StartPage;
