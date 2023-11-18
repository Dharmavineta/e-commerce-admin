"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import { ArrowUpDown } from "lucide-react";

export type ColorColumn = {
  id: string;
  name: string;
  colorValue: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
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
    accessorKey: "colorValue",
    header: "Color",
    cell: ({ row }) => (
      <>
        <div className="flex items-center gap-x-2">
          <div>{row.original.colorValue}</div>
          <div
            className="w-6 h-6 rounded-full border"
            style={{ background: row.original.colorValue }}
          />
        </div>
      </>
    ),
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
