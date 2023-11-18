import prismaDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const productId = "lkjlkj12kj4l2k3jlk";

    const cart = await prismaDB.cart.create({
      data: {
        userId: params.userId,
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.log("CART CREATE", error);
    return new NextResponse("Internal server error");
  }
}
