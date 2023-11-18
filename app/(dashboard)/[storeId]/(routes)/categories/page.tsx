import prismaDB from "@/lib/db";
import React, { FC } from "react";
import { format } from "date-fns";
import CategoryData from "./_components/CategoryData";
import { CategoryColumn } from "./_components/columns";

type props = {
  params: { storeId: string };
};

const Categories: FC<props> = async ({ params }) => {
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      billboard: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.label,
    billboardName: item.billboard.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <CategoryData categories={formattedCategories} />
      </div>
    </div>
  );
};

export default Categories;
