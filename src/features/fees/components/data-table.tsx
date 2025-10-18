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
    <div className="w-full overflow-hidden">
      <div className="w-full flex items-center justify-between py-4">
        <h4 className="text-[18px] font-semibold">Fees & Rates List</h4>
        {/* <div className="flex items-center justifye-end gap-2">
          <Link to={`/fees-rates/edit-fee`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Edit fee</Link>
          <Link to={`/fees-rates/edit-network-name`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">Edit network name</Link>
          <Link to={`/fees-rates/view-specific-fee`} className="bg-white border border-green-700 w-fit px-3 py-1 rounded text-xs text-primary">View specific fee</Link>
        </div> */}
      </div>
      <div className="w-full overflow-auto rounded-md shadow-sm">
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
          <TableBody>
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