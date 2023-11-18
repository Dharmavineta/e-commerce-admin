import { sizeFormType } from "@/app/(dashboard)/[storeId]/(routes)/sizes/[sizeId]/_components/SizeForm";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: sizeFormType = await req.json();

    const { name, sizeValue } = body;

    const session = await getAuthSession();
    const userId = session?.user.id;
    const storeId = params.storeId;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is needed", { status: 400 });
    }
    if (!sizeValue) {
      return new NextResponse("Value is needed", { status: 400 });
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
    const size = await prismaDB.size.create({
      data: {
        storeId,
        ...body,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log("Category POST", error);
    return new NextResponse("Internal server error");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const sizes = await prismaDB.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("SIZES ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
