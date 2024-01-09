import prismaDB from "@/lib/db";

export const getStockCount = async (storeId: string) => {
  const stockCount = await prismaDB.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
};
