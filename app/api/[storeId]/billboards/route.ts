import { billboardFormType } from "@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/_components/BillBoardForm";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: billboardFormType = await req.json();
    const { imageUrl, name } = body;

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
    const billboard = await prismaDB.billboard.create({
      data: {
        storeId,
        ...body,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.log("BILLBOARD POST", error);
    return new NextResponse("Internal server error");
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const billboards = await prismaDB.billboard.findMany({
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
