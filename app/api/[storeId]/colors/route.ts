import { colorFormType } from "@/app/(dashboard)/[storeId]/(routes)/colors/[colorId]/_components/ColorForm";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: colorFormType = await req.json();

    const { name, colorValue } = body;

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
    if (!colorValue) {
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
    const color = await prismaDB.color.create({
      data: {
        storeId,
        ...body,
      },
    });

    return NextResponse.json(color, { status: 200 });
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
    const colors = await prismaDB.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("COLORS ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
