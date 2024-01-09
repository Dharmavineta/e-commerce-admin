import Navbar from "@/components/common/Navbar";
import { getAuthSession } from "@/lib/next-auth-options";
import React, { FC } from "react";

type props = {
  children: React.ReactNode;
};

const layout: FC<props> = async ({ children }) => {
  const session = await getAuthSession();
  const userId = session?.user.id;

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
