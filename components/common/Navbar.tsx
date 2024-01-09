import React from "react";
import Nav from "../Nav";
import SwitchStores from "../SwitchStores";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import LogoutButton from "../LogoutButton";
import Link from "next/link";

const Navbar = async () => {
  const session = await getAuthSession();

  const userId = session?.user.id;

  const stores = await prismaDB.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border-b">
      <div className="h-16 flex justify-between items-center px-6">
        <div className="flex gap-x-5 items-center">
          <SwitchStores stores={stores} />
          <Nav />
        </div>
        {/* {userId ? (
          <LogoutButton />
        ) : (
          <Button variant={"link"} className="text-muted-foreground" asChild>
            <Link href={"/login"}>Login</Link>
          </Button>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
