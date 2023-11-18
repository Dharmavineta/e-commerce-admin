"use client";
import Heading from "@/components/common/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { columns, sizeColumn } from "./columns";

type props = {
  sizes: sizeColumn[];
};

const SizeData: FC<props> = ({ sizes }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage sizes for your store"
        />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Size
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={sizes} searchKey="name" />
      {/* <Heading title="End-points" description="Api endpoints for color" /> */}
      {/* <Separator /> */}
      {/* <EndPointsList /> */}
    </>
  );
};

export default SizeData;
