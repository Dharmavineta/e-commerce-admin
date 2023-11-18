import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import prismaDB from "@/lib/db";

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents
    .filter((address) => address !== null)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prismaDB.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    for (const item of order.orderItems) {
      const product = await prismaDB.product.findUnique({
        where: { id: item.productId },
      });
      if (product) {
        // await prismaDB.product.update({
        //     where:{id:product.id},
        //     data:{stock:product.stock- item.}
        // })
      }
    }
  }
}
