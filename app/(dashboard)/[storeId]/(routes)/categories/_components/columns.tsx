"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { ArrowUpDown } from "lucide-react";

export type CategoryColumn = {
  id: string;
  name: string;
  billboardName: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          role="button"
          className="flex hover:underline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
  },
  {
    accessorKey: "billboardName",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardName,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
