import prismaDB from "@/lib/db";
import React, { FC } from "react";
import BillboardData from "./_components/BillboardData";
import { getAuthSession } from "@/lib/next-auth-options";
import { BillBoardColumn } from "./_components/columns";
import { format } from "date-fns";

type props = {
  params: { storeId: string };
};

const BillBoards: FC<props> = async ({ params }) => {
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedBillboards: BillBoardColumn[] = billboards.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <BillboardData billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillBoards;
