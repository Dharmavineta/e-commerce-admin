import prismaDB from "@/lib/db";
import React, { FC } from "react";
import SizeForm from "./_components/SizeForm";

type props = {
  params: { sizeId: string; storeId: string };
};
const SizePage: FC<props> = async ({ params }) => {
  const size = await prismaDB.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm size={size} />
      </div>
    </div>
  );
};

export default SizePage;
