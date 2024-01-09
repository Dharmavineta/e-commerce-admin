import prismaDB from "@/lib/db";

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismaDB.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
