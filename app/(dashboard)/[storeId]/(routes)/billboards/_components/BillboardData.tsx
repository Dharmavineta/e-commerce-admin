"use client";
import Heading from "@/components/common/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import EndPointsList from "./EndPointsList";
import { useParams, useRouter } from "next/navigation";
import { BillBoardColumn, columns } from "./columns";

type props = {
  billboards: BillBoardColumn[];
};

const BillboardData: FC<props> = ({ billboards }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage Billboards for your store"
        />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Billboard
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={billboards} searchKey="name" />
      {/* <Heading title="End-points" description="Api endpoints for Billboards" /> */}
      {/* <Separator /> */}
      {/* <EndPointsList /> */}
    </>
  );
};

export default BillboardData;
