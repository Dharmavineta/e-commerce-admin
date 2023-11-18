import React, { useEffect, useState } from "react";

const useOriginURL = () => {
  const [mounted, setMounted] = useState(false);

  const originUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return originUrl;
};

export default useOriginURL;
