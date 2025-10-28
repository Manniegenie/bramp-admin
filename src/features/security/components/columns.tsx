"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { CryptoFee } from "@/features/fees/type/fee"
import { CopyIcon } from "lucide-react"

export const columns: ColumnDef<CryptoFee>[] = [
  {
    accessorKey: "currency",
    header: "Created at",
  },
  {
    accessorKey: "network",
    header: "Token",
  },
  {
    accessorKey: "networkName",
    header: "Notes/device",
  },
  {
    accessorKey: "networkFee",
    header: "Expires",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <>
        <button
          className="bg-primary hover:bg-green-800 text-[14px] text-white px-2 py-1 rounded mr-2"
          onClick={() => alert(`Edit fee for ${row.original.currency} - ${row.original.network}`)}
        >
          <CopyIcon className="h-3 w-3" /> Copy
        </button>
      </>
    ),
  },
]