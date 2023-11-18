import prismaDB from "@/lib/db";
import React, { FC } from "react";
import { format } from "date-fns";
import { sizeColumn } from "./_components/columns";
import SizeData from "./_components/SizeData";

type props = {
  params: { storeId: string };
};

const Sizes: FC<props> = async ({ params }) => {
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: sizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    sizeValue: item.sizeValue,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <SizeData sizes={formattedSizes} />
      </div>
    </div>
  );
};

export default Sizes;
