"use client"
import React from "react";
import type { ColumnDef } from "@tanstack/react-table"
import type { Transaction } from '../type/analytic'

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Transaction ID",
    cell: info => {
      const value = info.getValue() as string;
      return value ? (
        <span className="font-mono text-xs">{value}</span>
      ) : '—';
    }
  },
  {
    accessorKey: "username",
    header: "User",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: info => {
      const type = info.getValue() as string;
      const badges: Record<string, string> = {
        'SELL': 'bg-emerald-100 text-emerald-800',
        'BUY': 'bg-cyan-100 text-cyan-800'
      };
      const className = badges[type] || 'bg-gray-100 text-gray-800';
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
          {type}
        </span>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: info => {
      const status = info.getValue() as string;
      const badges: Record<string, string> = {
        'CONFIRMED': 'bg-green-100 text-green-800',
        'PENDING': 'bg-yellow-100 text-yellow-800',
        'EXPIRED': 'bg-gray-100 text-gray-800'
      };
      const className = badges[status] || 'bg-gray-100 text-gray-800';
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${className}`}>
          {status}
        </span>
      );
    }
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: info => {
      const currency = info.getValue() as string;
      return <span className="font-mono font-semibold">{currency}</span>;
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: info => {
      const amount = info.getValue() as number;
      const isNegative = amount < 0;
      return (
        <span className={`font-mono ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {isNegative ? '-' : '+'}{Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
        </span>
      );
    }
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: info => {
      const value = info.getValue() as string;
      return value ? (
        <span className="font-mono text-sm">{value.substring(0, 12)}...</span>
      ) : '—';
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: info => {
      const date = new Date(info.getValue() as string);
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-gray-500 text-xs">{date.toLocaleTimeString()}</div>
        </div>
      );
    }
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const tx = row.original;

      // Show chatbot transaction details (SELL/BUY only)
      return (
        <div className="text-xs space-y-1">
          <div className="font-medium">{tx.token} {tx.network}</div>
          {tx.paymentId && (
            <div className="text-gray-500 font-mono">{tx.paymentId}</div>
          )}
          {tx.depositAddress && (
            <div className="text-gray-500 font-mono">{tx.depositAddress.substring(0, 8)}...</div>
          )}
          {tx.payout?.bankName && (
            <div className="text-gray-500">{tx.payout.bankName}</div>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const tx = row.original;

      return (
        <div className="relative">
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="More actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  navigator.clipboard.writeText(tx.id);
                  alert('Transaction ID copied');
                }}
              >
                Copy Transaction ID
              </button>
              {tx.reference && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOpen(false);
                    navigator.clipboard.writeText(tx.reference!);
                    alert('Reference copied');
                  }}
                >
                  Copy Reference
                </button>
              )}
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => {
                  setOpen(false);
                  alert(`View details for ${tx.id}`);
                }}
              >
                View Full Details
              </button>
              {tx.userId && (
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setOpen(false);
                    alert(`View user ${tx.username || tx.userId}`);
                  }}
                >
                  View User
                </button>
              )}
            </div>
          )}
        </div>
      );
    },
  },
]