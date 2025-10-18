"use client"
import type { ColumnDef } from "@tanstack/react-table"
import type { GiftCardRate } from "../type/giftCardRate.types";
import { Button } from "@/components/ui/button";
import { Edit2, MoreHorizontal, Trash2Icon } from "lucide-react";
import { toast } from 'sonner'
import { updateGiftCardRateAPI } from '../services/giftCardRateService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const giftCardColumns: ColumnDef<GiftCardRate>[] = [
  { accessorKey: "cardType", header: "Card type" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "rateDisplay", header: "Base rate" },
  { accessorKey: "physicalRate", header: "Physical" },
  { accessorKey: "ecodeRate", header: "E-code" },
  { accessorKey: "minAmount", header: "Min amount" },
  { accessorKey: "maxAmount", header: "Max amount" },
  { accessorKey: "lastUpdated", header: "Last updated" },
  { accessorKey: "updatedBy", header: "Updated by" },
  { 
    accessorKey: "isActive", 
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-white">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white text-black/90 border border-gray-200 shadow-none">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const id = row.original.id as string
                  // Prompt simple inputs - replace with proper edit modal as needed
                  const newRateRaw = window.prompt('Enter new base rate (leave empty to skip):', String(row.original.rate || ''))
                  if (newRateRaw === null) return; // cancelled
                  const newRate = newRateRaw === '' ? undefined : Number(newRateRaw)

                  const orig = row.original as unknown as Partial<Record<string, unknown>>
                  const newNotes = window.prompt('Notes (optional):', (orig.notes as string) || '')
                  if (newNotes === null) return; // cancelled

                  const activeConfirm = window.confirm('Mark as active? OK = active, Cancel = inactive')

                  const body: { rate?: number; isActive?: boolean; notes?: string } = {}
                  if (typeof newRate === 'number' && !Number.isNaN(newRate)) body.rate = newRate
                  body.notes = newNotes || ''
                  body.isActive = activeConfirm

                  const res = await updateGiftCardRateAPI(id, body)
                  toast.success(res?.message || 'Rate updated')
                  // let parent update if listening
                  window.dispatchEvent(new CustomEvent('giftcard:updated', { detail: { id } }))
                } catch (err) {
                  console.error('Update failed', err)
                  toast.error('Failed to update rate')
                }
              }}
            >
              <Edit2 className="h-3 w-3" />Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Request the parent component to confirm deletion
                const id = row.original.id as string
                window.dispatchEvent(new CustomEvent('giftcard:delete-request', { detail: { id } }))
              }}
              className="text-red-500 hover:bg-red-100"
            >
              <Trash2Icon className="h-3 w-3" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
]