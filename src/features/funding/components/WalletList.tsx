import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Copy, ScanBarcode } from "lucide-react"
import type { FetchWalletsResponse, WalletEntry } from '@/features/users/types/userApi.types';
import { toast } from 'sonner';

export function WalletList({ data }: { data?: FetchWalletsResponse | null }) {
  const handleCopy = async (address?: string) => {
    if (!address) {
      toast.error('No address to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    } catch (err) {
      console.error('clipboard error', err);
      toast.error('Failed to copy address');
    }
  };

  const handleScan = (address?: string) => {
    if (!address) {
      toast.error('No address to generate QR');
      return;
    }
    // Open a QR image in a new tab using Google Chart API
    const url = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };
  // If no data provided, render placeholder accordion
  if (!data) {
    return (
      <div></div>
      // <Accordion
      //   type="single"
      //   collapsible
      //   className="w-full space-y-1"
      //   defaultValue="item-1"
      // >
      //   <AccordionItem value="item-1" className="border-b-0">
      //     <AccordionTrigger className="border border-gray-200 px-4">BTC. Bitcoin</AccordionTrigger>
      //     <AccordionContent className="flex flex-col gap-4 text-balance border border-gray-200 p-8">
      //       <div className="bg-gray-100 border border-gray-200 p-4 rounded flex flex-col gap-6 items-center justify-center md:flex-row md:justify-between w-full">
      //         <div className="w-fit flex flex-col justify-center items-start gap-2">
      //           <span className="text-[14px]"><span className="text-gray-700">Wallet address:</span> <span>1A1zP1...DivfNa</span></span>
      //           <div className="flex items-center gap-3"><span className="text-[40px] font-medium">0.778 BTC</span> <span className="text-medium ">($45,760.32)</span></div>
      //           <span className="text-sx text-orange-400">Pending amount: 0.00 BTC</span>
      //         </div>
      //         <div className="w-fit flex items-center gap-4">
      //           <Button className="text-white bg-primary font-normal"><Copy className="h-4 w-4"/> Copy</Button>
      //           <Button className="text-white bg-black font-normal"><ScanBarcode className="h-4 w-4"/> Scan QR code</Button>
      //         </div>
      //       </div>
      //     </AccordionContent>
      //   </AccordionItem>
      // </Accordion>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-1">
      {Object.entries(data.wallets).map(([token, entry]) => (
        <AccordionItem key={token} value={token} className="border-b-0">
          <AccordionTrigger className="border border-gray-200 px-4">{token}</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance border border-gray-200 p-8">
            <div className="bg-gray-100 border border-gray-200 p-4 rounded flex flex-col gap-6 items-center justify-center md:flex-row md:justify-between w-full">
              <div className="w-fit flex flex-col justify-center items-start gap-2">
                <span className="text-[14px]"><span className="text-gray-700">Wallet address:</span> <span>{(entry as WalletEntry).address}</span></span>
                <div className="flex items-center gap-3"><span className="text-[40px] font-medium">{data.balances?.[`${token.split('_')[0].toLowerCase()}Balance`] ?? '—'}</span> <span className="text-medium ">(${data.balances?.[`${token.split('_')[0].toLowerCase()}BalanceUSD`] ?? '—'})</span></div>
                <span className="text-sx text-orange-400">Pending amount: 0.00 {token.split('_')[0]}</span>
              </div>
              <div className="w-fit flex items-center gap-4">
                <Button
                  className="text-white bg-primary font-normal"
                  onClick={() => handleCopy((entry as WalletEntry).address ?? undefined)}
                >
                  <Copy className="h-4 w-4"/> Copy
                </Button>
                <Button
                  className="text-white bg-black font-normal"
                  onClick={() => handleScan((entry as WalletEntry).address ?? undefined)}
                >
                  <ScanBarcode className="h-4 w-4"/> Scan QR code
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
