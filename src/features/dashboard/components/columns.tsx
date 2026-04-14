"use client"
import React from "react";
import type { ColumnDef } from "@tanstack/react-table"
import type { Transaction } from '../type/analytic'

function Truncated({ value, className = '' }: { value: string; className?: string }) {
  return (
    <span className={`block truncate ${className}`} title={value}>
      {value}
    </span>
  );
}

const STATUS_BADGES: Record<string, string> = {
  CONFIRMED:  'bg-green-100 text-green-800',
  SUCCESSFUL: 'bg-green-200 text-green-900',
  COMPLETED:  'bg-green-200 text-green-900',
  PENDING:    'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  FAILED:     'bg-red-100 text-red-800',
  REJECTED:   'bg-red-200 text-red-900',
  APPROVED:   'bg-emerald-100 text-emerald-800',
};

const TYPE_BADGES: Record<string, string> = {
  DEPOSIT:    'bg-cyan-100 text-cyan-800',
  WITHDRAWAL: 'bg-orange-100 text-orange-800',
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: info => {
      const date = new Date(info.getValue() as string);
      return (
        <div className="text-xs">
          <div className="font-medium">{date.toLocaleDateString()}</div>
          <div className="text-gray-400">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "username",
    header: "User",
    cell: info => {
      const tx = info.row.original;
      const name = (info.getValue() as string) || tx.userEmail || '—';
      return <Truncated value={name} className="text-xs" />;
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: info => {
      const type = info.getValue() as string;
      const cls = TYPE_BADGES[type] || 'bg-gray-100 text-gray-800';
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{type}</span>;
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: info => {
      const status = info.getValue() as string;
      const cls = STATUS_BADGES[status] || 'bg-gray-100 text-gray-800';
      return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
    }
  },
  {
    accessorKey: "currency",
    header: "Token",
    cell: info => {
      const currency = info.getValue() as string;
      return <span className="font-mono font-semibold text-xs">{currency}</span>;
    }
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: info => {
      const value = info.getValue() as string | undefined;
      return value ? <span className="font-mono text-xs">{value}</span> : <span className="text-gray-300">—</span>;
    }
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: info => {
      const tx = info.row.original;
      const amount = info.getValue() as number;
      const isWithdrawal = tx.type === 'WITHDRAWAL';

      if (isWithdrawal) {
        // Show requested NGNB amount from metadata
        const requested = (tx as any).metadata?.requestedAmount ?? Math.abs(amount);
        return <span className="font-mono text-xs text-orange-600">₦{Number(requested).toLocaleString()}</span>;
      }

      // Deposit: show crypto amount
      const abs = Math.abs(amount);
      return (
        <span className="font-mono text-xs text-cyan-700">
          {abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
        </span>
      );
    }
  },
  {
    id: "ngnbValue",
    header: "NGNB",
    cell: ({ row }) => {
      const tx = row.original as any;
      if (tx.type === 'DEPOSIT') {
        const val = tx.actualReceiveAmount ?? tx.metadata?.ngnbCredited;
        return val != null
          ? <span className="font-mono text-xs text-green-700">₦{Math.round(val).toLocaleString()}</span>
          : <span className="text-gray-300 text-xs">—</span>;
      }
      if (tx.type === 'WITHDRAWAL') {
        const refunded = tx.metadata?.refundAmount;
        return refunded != null
          ? <span className="font-mono text-xs text-red-500">↩ ₦{Math.round(refunded).toLocaleString()}</span>
          : <span className="text-gray-300 text-xs">—</span>;
      }
      return <span className="text-gray-300 text-xs">—</span>;
    }
  },
  {
    accessorKey: "narration",
    header: "Note",
    cell: info => {
      const value = info.getValue() as string | undefined;
      return value
        ? <Truncated value={value} className="text-xs text-gray-500" />
        : <span className="text-gray-300 text-xs">—</span>;
    }
  },
  {
    accessorKey: "obiexTransactionId",
    header: "Obiex ID",
    cell: info => {
      const value = (info.getValue() as string | undefined) || (info.row.original as any).transactionId;
      return value ? <Truncated value={value} className="font-mono text-xs" /> : <span className="text-gray-300 text-xs">—</span>;
    }
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: info => {
      const value = info.getValue() as string | undefined;
      return value ? <Truncated value={value} className="font-mono text-xs" /> : <span className="text-gray-300 text-xs">—</span>;
    }
  },
  {
    accessorKey: "hash",
    header: "Tx Hash",
    cell: info => {
      const value = info.getValue() as string | undefined;
      return value ? <Truncated value={value} className="font-mono text-xs" /> : <span className="text-gray-300 text-xs">—</span>;
    }
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);
      const tx = row.original as any;

      return (
        <div className="relative">
          <button
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => setOpen(prev => !prev)}
            aria-label="More actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-10">
              <button
                className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                onClick={() => { setOpen(false); navigator.clipboard.writeText(tx.id); }}
              >
                Copy Txn ID
              </button>
              {tx.reference && (
                <button
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                  onClick={() => { setOpen(false); navigator.clipboard.writeText(tx.reference); }}
                >
                  Copy Reference
                </button>
              )}
              {tx.obiexTransactionId && (
                <button
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                  onClick={() => { setOpen(false); navigator.clipboard.writeText(tx.obiexTransactionId); }}
                >
                  Copy Obiex ID
                </button>
              )}
              {tx.hash && (
                <button
                  className="block w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                  onClick={() => { setOpen(false); navigator.clipboard.writeText(tx.hash); }}
                >
                  Copy Tx Hash
                </button>
              )}
            </div>
          )}
        </div>
      );
    }
  },
]
