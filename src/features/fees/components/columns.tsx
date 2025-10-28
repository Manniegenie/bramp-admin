"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { CryptoFee } from "../type/fee";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    header: "Network name",
  },
  {
    accessorKey: "networkFee",
    header: "Fee (USD)",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const fee = row.original as CryptoFee;
      return (
        <div className="flex items-center gap-2">
          <Link to={`/fees-rates/view/${fee.currency}/${encodeURIComponent(fee.network)}`} state={{ fee }}>
            <Button size="sm" variant="ghost">View</Button>
          </Link>
          <Link to="/fees-rates/edit-fee" state={{ fee }}>
            <Button size="sm" variant="outline">Edit</Button>
          </Link>
          <Link to="/fees-rates/edit-network-name" state={{ fee }}>
            <Button size="sm">Edit Name</Button>
          </Link>
        </div>
      );
    },
  },
];