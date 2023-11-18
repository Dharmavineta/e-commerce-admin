"use client";
import Heading from "@/components/common/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, columns } from "./columns";

type props = {
  colors: ColorColumn[];
};

const ColorData: FC<props> = ({ colors }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`colors (${colors.length})`}
          description="Manage colors for your store"
        />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Color
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colors} searchKey="name" />
      {/* <Heading title="End-points" description="Api endpoints for color" /> */}
      {/* <Separator /> */}
      {/* <EndPointsList /> */}
    </>
  );
};

export default ColorData;
