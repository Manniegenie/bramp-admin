"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { CryptoFee } from "@/features/fees/type/fee"

export const columns: ColumnDef<CryptoFee>[] = [
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "network",
    header: "Network",
  },
  {
    accessorKey: "networkName",
    header: "Network Name",
  },
  {
    accessorKey: "networkFee",
    header: "Fee (USD)",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <>
        <button
          className="bg-primary hover:bg-green-800 text-[14px] text-white px-2 py-1 rounded mr-2"
          onClick={() => alert(`Edit fee for ${row.original.currency} - ${row.original.network}`)}
        >
          Edit
        </button>
        <button
          className="bg-[#343330] text-[14px] text-white hover:bg-black/80 px-2 py-1 rounded"
          onClick={() => alert(`Edit fee for ${row.original.currency} - ${row.original.network}`)}
        >
          Edit Network Name
        </button>
      </>
    ),
  },
]