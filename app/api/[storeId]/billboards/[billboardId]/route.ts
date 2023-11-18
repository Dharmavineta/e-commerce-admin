import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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

    const deletedBillboard = await prismaDB.billboard.delete({
      where: {
        storeId,
        id: params.billboardId,
      },
    });
    return NextResponse.json("Billboard deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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

    const updatedBillboard = await prismaDB.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json("Billboard updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }
    const billboard = await prismaDB.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD GET", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}
