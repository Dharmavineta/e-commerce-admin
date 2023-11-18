import prismaDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string; cartId: string } }
) {
  try {
    const { action, product } = req.body;

    if (action === "add") {
    }
    if (action === "remove") {
    }

    if (action === "delete") {
    }
  } catch (error) {
    console.log("CART CREATE", error);
    return new NextResponse("Internal server error");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; cartId: string } }
) {
  try {
    const cart = await prismaDB.cartItem.deleteMany({
      where: {
        cartId: params.cartId,
      },
    });
    return NextResponse.json(cart);
  } catch (error) {
    console.log("EMPTY CART", error);
    return new NextResponse("Internal server error");
  }
}
