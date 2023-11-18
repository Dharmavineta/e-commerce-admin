import prismaDB from "@/lib/db";
import React, { FC } from "react";
import CategoryForm from "./_components/CategoryForm";

type props = {
  params: { categoryId: string; storeId: string };
};
const CategoryPage: FC<props> = async ({ params }) => {
  const category = await prismaDB.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
