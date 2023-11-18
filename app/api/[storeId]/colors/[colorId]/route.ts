import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const session = await getAuthSession();
    const userId = session?.user.id;
    const storeId = params.storeId;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    const store = await prismaDB.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("No store found", { status: 400 });
    }

    const deletedcolor = await prismaDB.color.delete({
      where: {
        storeId,
        id: params.colorId,
      },
    });
    return NextResponse.json("color deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const body = await req.json();
    const session = await getAuthSession();
    const userId = session?.user.id;
    const storeId = params.storeId;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    const store = await prismaDB.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("No store found", { status: 400 });
    }

    const updatedColor = await prismaDB.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json("Color updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error");
  }
}
