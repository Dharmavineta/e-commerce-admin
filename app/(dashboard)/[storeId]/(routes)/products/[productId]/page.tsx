import prismaDB from "@/lib/db";
import React, { FC } from "react";
import ProductForm from "./_components/ProductForm";

type props = {
  params: { productId: string; storeId: string };
};
const ProductPage: FC<props> = async ({ params }) => {
  const product = await prismaDB.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const colors = await prismaDB.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <ProductForm
          product={product}
          colors={colors}
          sizes={sizes}
          categories={categories}
        />
      </div>
    </div>
  );
};

export default ProductPage;
