import Heading from "@/components/common/Heading";
import prismaDB from "@/lib/db";
import React, { FC } from "react";
import BillBoardForm from "./_components/BillBoardForm";

type props = {
  params: { storeId: string; billboardId: string };
};

const BillboardPage: FC<props> = async ({ params }) => {
  const billboard = await prismaDB.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="p-8 flex flex-col">
      <div className="flex-1 space-y-4">
        <BillBoardForm billboard={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
