"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import CellAction from "./CellAction";

export type sizeColumn = {
  id: string;
  name: string;
  sizeValue: string;
  createdAt: string;
};

export const columns: ColumnDef<sizeColumn>[] = [
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
    accessorKey: "sizeValue",
    header: "Size-value",
    cell: ({ row }) => row.original.sizeValue,
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
