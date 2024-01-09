import { createStoreType } from "@/components/modals/StoreModal";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body: createStoreType = await req.json();
    const session = await getAuthSession();

    const userId = session?.user.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!body.name) {
      return new NextResponse("Store name required", { status: 400 });
    }

    const store = await prismaDB.store.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.log("CREATE STORE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
