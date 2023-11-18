"use client";
import Heading from "@/components/common/Heading";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";

type props = {
  categories: CategoryColumn[];
};

const CategoryData: FC<props> = ({ categories }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${categories.length})`}
          description="Manage categories for your store"
        />
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} searchKey="name" />
      {/* <Heading title="End-points" description="Api endpoints for categories" /> */}
      {/* <Separator /> */}
      {/* <EndPointsList /> */}
    </>
  );
};

export default CategoryData;
