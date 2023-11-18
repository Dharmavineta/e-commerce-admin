import prismaDB from "@/lib/db";
import React, { FC } from "react";
import { format } from "date-fns";
import { ColorColumn } from "./_components/columns";
import ColorData from "./_components/ColorData";

type props = {
  params: { storeId: string };
};

const Colors: FC<props> = async ({ params }) => {
  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    colorValue: item.colorValue,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <ColorData colors={formattedColors} />
      </div>
    </div>
  );
};

export default Colors;
