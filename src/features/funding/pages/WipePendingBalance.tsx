import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from "@/components/ui/card";
import { DashboardTitleContext } from "@/layouts/DashboardTitleContext";
// removed unused imports
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// lucide icons and WalletList were unused — removed to fix build warnings
import { fetchUserWallets, wipePendingBalance } from "@/features/users/services/usersService";
import type { FetchWalletsResponse } from "@/features/users/types/userApi.types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function WipePendingBalance() {
  const titleCtx = useContext(DashboardTitleContext);
  const location = useLocation();
  const navState = (location.state ?? {}) as { user?: { email?: string } };
  // removed unused selects — using tokens input instead

  const [userEmail, setUserEmail] = useState<string>(
    () => navState.user?.email ?? ""
  );
  const [selectedTokens, _setSelectedTokens] = useState<string[]>([]);
  const [_walletData, _setWalletData] = useState<FetchWalletsResponse | null>(
    null
  );
  const [_loading, _setLoading] = useState(false);
  const [_searchTerm, _setSearchTerm] = useState<string>("");
  const [wipeLoading, setWipeLoading] = useState(false);
  const [wipeCurrency, setWipeCurrency] = useState<string>('BTC');
  const [confirmOpen, setConfirmOpen] = useState(false);

  // exportCsv intentionally removed (not currently used)

  useEffect(() => {
    titleCtx?.setTitle("Wallet");
    titleCtx?.setBreadcrumb([
      "Funding & Balance",
      "User Wallet",
      "Fetch by user email",
    ]);
  }, [titleCtx]);

  // TODO: Replace with actual data from your API

  // handleSearch intentionally removed (not currently used)

  const handleWipe = async () => {
    // open dialog for confirmation
    setConfirmOpen(true);
  };

  const handleWipeConfirmed = async () => {
    if (!userEmail) {
      toast.error('Please provide a user email');
      setConfirmOpen(false);
      return;
    }
    if (!wipeCurrency) {
      toast.error('Please select a currency to wipe');
      setConfirmOpen(false);
      return;
    }
    try {
      setWipeLoading(true);
      const res = await wipePendingBalance(userEmail, wipeCurrency);
      toast.success(res?.message ?? 'Pending balance wiped');
      // refetch wallets if tokens were selected
      if (selectedTokens.length > 0) {
        try {
          const fresh = await fetchUserWallets(userEmail, selectedTokens);
          _setWalletData(fresh);
        } catch (err) {
        }
      }
      setConfirmOpen(false);
    } catch (err) {
      console.error('wipe failed', err);
      toast.error('Failed to wipe pending balance');
    } finally {
      setWipeLoading(false);
    }
  };

  return (
    <div className="w-full px-10">
      <div className="w-full max-w-2xl mx-auto mt-4 space-y-6">
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="py-6 px-4">
            <div className="w-full py-4 flex flex-col justify-center items-start gap-5">
                <p className="text-sm text-gray-600">Clear the user's pending balance for a specific currency.</p>
              <div className="w-full space-y-2">
                <Label
                  className="text-sm font-medium text-gray-500"
                  htmlFor="userEmail"
                >
                  User email
                </Label>
                <Input
                  type="text"
                  name="userEmail"
                  className="w-full py-6 border-gray-300"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
              <div className="w-full">
                <Label className="text-sm font-medium text-gray-500">Currency</Label>
                <Select onValueChange={(v) => setWipeCurrency(v)}>
                  <SelectTrigger className="w-full h-10 border border-gray-300">
                    <SelectValue placeholder={wipeCurrency} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {['BTC','ETH','SOL','USDT','USDC','NGNB'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                <div className="flex w-full gap-1">
                    <Button variant="ghost" className="w-1/2 h-10 border border-red-500" onClick={() => setWipeCurrency('BTC')}>Reset</Button>
                    <Button className="w-1/2 text-white h-10" onClick={handleWipe} disabled={wipeLoading}>
                    {wipeLoading ? 'Wiping…' : 'Wipe pending balance'}
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className='bg-white w-full max-w-md text-black/90 border border-gray-200 shadow-lg'>
          <DialogHeader>
            <DialogTitle>Confirm wipe pending balance</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to wipe the pending balance for <strong>{userEmail}</strong> ({wipeCurrency})? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button className='bg-white border border-gray-300' onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleWipeConfirmed} className='bg-red-500 text-white'>{wipeLoading ? 'Wiping…' : 'Wipe pending balance'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
