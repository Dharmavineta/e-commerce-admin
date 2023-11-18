import { createStoreType } from "@/components/modals/StoreModal";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getAuthSession();
    const userId = session?.user.id;

    const body: createStoreType = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!body.name) {
      return new NextResponse("Store name cannot be empty", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const store = await prismaDB.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_EDIT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getAuthSession();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const store = await prismaDB.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_EDIT", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
