import prismaDB from "@/lib/db";
import React, { FC } from "react";
import ColorForm from "./_components/ColorForm";

type props = {
  params: { colorId: string; storeId: string };
};
const ColorPage: FC<props> = async ({ params }) => {
  const color = await prismaDB.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm color={color} />
      </div>
    </div>
  );
};

export default ColorPage;
