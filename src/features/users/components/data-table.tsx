"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Link } from "react-router-dom"
import { User2Icon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between py-4">
        <h4 className="text-[18px] font-semibold">User List</h4>
        <div className="flex items-center justify-end gap-2">
          <Link to={`/user-management/create-new-admin`} className="bg-primary text-white border border-green-700 w-fit px-3 py-1 rounded text-xs flex items-center gap-2"><User2Icon className="h-3 w-4" /> Add user</Link>
          {/* <Link to={`/user-management/disable-2fa`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Disable 2fa</Link> */}
          {/* <Link to={`/user-management/remove-password`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Remove password</Link>
          <Link to={`/user-management/wallet`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Wallet</Link>
          <Link to={`/user-management/wipe-pending-balance`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Wipe pending balance</Link>
          <Link to={`/user-management/wallet-generation`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Wallet generation</Link> */}
        </div>
      </div>
      <div className="w-full rounded-md shadow-sm">
        <Table className="w-full border border-gray-200">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-visible">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-b border-gray-200 last:border-0"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}