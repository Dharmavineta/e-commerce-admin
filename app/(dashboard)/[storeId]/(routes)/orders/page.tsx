import prismaDB from "@/lib/db";
import React, { FC } from "react";
import { format } from "date-fns";
import { OrderColumn } from "./_components/columns";
import { formatter } from "@/lib/utils";
import OrderData from "./_components/OrderData";

type props = {
  params: { storeId: string };
};

const Orders: FC<props> = async ({ params }) => {
  const orders = await prismaDB.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((order) => order.product.name).join(","),
    totalPrice: formatter.format(
      item.orderItems.reduce((acc, order, i) => {
        return acc + Number(order.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-5 px-8 pt-6">
        <OrderData orders={formattedOrders} />
      </div>
    </div>
  );
};

export default Orders;
