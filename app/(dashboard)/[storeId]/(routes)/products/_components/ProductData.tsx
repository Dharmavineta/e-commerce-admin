"use client";
import Heading from "@/components/common/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, columns } from "./columns";

type props = {
  products: ProductColumn[];
};

const ProductData: FC<props> = ({ products }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store"
        />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Product
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} searchKey="name" />
      {/* <Heading title="End-points" description="Api endpoints for products" /> */}
      {/* <Separator /> */}
      {/* <EndPointsList /> */}
    </>
  );
};

export default ProductData;
