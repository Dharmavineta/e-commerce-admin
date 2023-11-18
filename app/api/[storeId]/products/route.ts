import { productFormType } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/_components/ProductForm";
import prismaDB from "@/lib/db";
import { getAuthSession } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: productFormType = await req.json();

    const {
      images,
      name,
      price,
      isArchived,
      isFeatured,
      isHotDeals,
      categoryId,
      colorId,
      sizeId,
    } = body;

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

    if (!images) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is needed", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Price is needed", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Price is needed", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Price is needed", { status: 400 });
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

    const product = await prismaDB.product.create({
      data: {
        storeId: params.storeId,
        ...body,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });

    return NextResponse.json(product, { status: 200 });
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
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeature = searchParams.get("isFeatured");
    const products = await prismaDB.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeature ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        color: true,
        sizes: true,
        category: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("COLORS ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
