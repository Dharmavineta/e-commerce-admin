import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { redirect } from "next/navigation";
import React, { FC } from "react";

type props = {
  children: React.ReactNode;
};

const layout: FC<props> = async ({ children }) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const store = await prismaDB.store.findFirst({
    where: {
      userId: session.user.id,
    },
  });
  if (store) {
    return redirect(`/${store.id}`);
  }

  return <div>{children}</div>;
};

export default layout;
