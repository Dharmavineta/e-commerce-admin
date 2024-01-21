import Navbar from "@/components/common/Navbar";
import { getAuthSession } from "@/lib/next-auth-options";
import { redirect } from "next/navigation";
import React, { FC } from "react";

type props = {
  children: React.ReactNode;
};

const layout: FC<props> = async ({ children }) => {
  const session = await getAuthSession();
  const userId = session?.user.id;

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
