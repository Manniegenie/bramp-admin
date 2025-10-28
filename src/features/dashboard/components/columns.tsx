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
        'COMPLETED': 'bg-green-200 text-green-900',
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
    id: "flags",
    header: "Deposit/Withdrawal",
    cell: ({ row }) => {
      const tx = row.original;

      const depositConfirmed = tx.status === 'CONFIRMED' || tx.status === 'COMPLETED';
      const withdrawalCompleted = tx.payoutStatus === 'SUCCESS';

      const Check = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
      );

      return (
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Deposit Confirmed</span>
            {depositConfirmed ? <Check /> : <span>-</span>}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Withdrawal Completed</span>
            {withdrawalCompleted ? <Check /> : <span>-</span>}
          </div>
        </div>
      );
    }
  },
  {
    id: "details",
    header: "Full Details",
    cell: ({ row }) => {
      const tx = row.original;
      return (
        <div className="text-xs space-x-4 whitespace-nowrap overflow-x-auto max-w-[60vw]">
          <span className="font-medium">{tx.token} {tx.network}</span>
          {tx.paymentId && (<span className="text-gray-500 font-mono">PID: {tx.paymentId}</span>)}
          {tx.webhookRef && (<span className="text-gray-500 font-mono">WH: {tx.webhookRef}</span>)}
          {tx.depositAddress && (<span className="text-gray-500 font-mono">Addr: {tx.depositAddress}</span>)}
          {tx.depositMemo && (<span className="text-gray-500 font-mono">Memo: {tx.depositMemo}</span>)}
          {typeof tx.sellAmount !== 'undefined' && (<span>Sell: {tx.sellAmount}</span>)}
          {typeof tx.receiveAmount !== 'undefined' && (<span>Quote NGN: {tx.receiveAmount}</span>)}
          {typeof tx.actualReceiveAmount !== 'undefined' && (<span>Actual NGN: {tx.actualReceiveAmount}</span>)}
          {tx.payout?.bankName && (<span>Payout Bank: {tx.payout.bankName}</span>)}
          {tx.payoutStatus && (<span>Payout Status: {tx.payoutStatus}</span>)}
          {tx.status && (<span>Status: {tx.status}</span>)}
          {tx.expiresAt && (<span>Expires: {new Date(tx.expiresAt).toLocaleString()}</span>)}
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