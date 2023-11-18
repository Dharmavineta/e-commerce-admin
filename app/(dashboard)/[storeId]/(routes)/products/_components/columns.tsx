"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { ArrowUpDown } from "lucide-react";

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  color: string;
  category: string;
  colorValue: string;
  size: string;
  sizeValue: string;
  isArchived: boolean;
  isFeatured: boolean;
  isHotDeals: boolean;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          role="button"
          className="flex hover:underline items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.name}</div>
    ),
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <>
        <div className="flex items-center gap-x-2 whitespace-nowrap">
          <div className=" ">{row.original.color}</div>
          <div
            className="w-5 h-5 rounded-full border-[1.5px]"
            style={{ background: row.original.colorValue }}
          />
        </div>
      </>
    ),
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex gap-x-1">
        <div className="flex justify-center">{row.original.sizeValue}</div>
        <span className="font-medium">({row.original.size})</span>
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isHotDeals",
    header: "Hot-Deals",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },

  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
