import prismaDB from "@/lib/db";
import React, { FC } from "react";
import { format } from "date-fns";
import CategoryData from "./_components/ProductData";
import { ProductColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";
import ProductData from "./_components/ProductData";

type props = {
  params: { storeId: string };
};

const Products: FC<props> = async ({ params }) => {
  const products = await prismaDB.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      color: true,
      sizes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    category: item.category.label,
    size: item.sizes.name,
    color: item.color.name,
    colorValue: item.color.colorValue,
    sizeValue: item.sizes.sizeValue,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    isHotDeals: item.isHotDeals,
    stock: item.stock,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <ProductData products={formattedProducts} />
      </div>
    </div>
  );
};

export default Products;
