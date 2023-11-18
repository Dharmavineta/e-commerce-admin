import { CategoryFormType } from "@/app/(dashboard)/[storeId]/(routes)/categories/[categoryId]/_components/CategoryForm";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: CategoryFormType = await req.json();

    const { billboardId, label } = body;

    const session = await getAuthSession();
    const userId = session?.user.id;
    const storeId = params.storeId;

    if (!params.storeId) {
      return new NextResponse("StoreId is required", { status: 401 });
    }
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Name is needed", { status: 400 });
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
    const category = await prismaDB.category.create({
      data: {
        storeId,
        ...body,
      },
    });

    return NextResponse.json(category, { status: 200 });
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
    const billboards = await prismaDB.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("BILLBOARD ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
