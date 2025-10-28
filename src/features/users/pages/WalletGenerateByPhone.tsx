import { useContext, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardTitleContext } from "@/layouts/DashboardTitleContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "react-router-dom";
import { generateWalletsByPhone, statusByPhone } from "@/features/users/services/usersService";
// removed duplicate useEffect import
import { toast } from "sonner";
// select UI not used on this page

export function WalletGenerateByPhone() {
  const titleCtx = useContext(DashboardTitleContext);

  const location = useLocation();
  interface RouteState { state?: { user?: { phonenumber?: string } } }
  const stateUser = ((location as unknown) as RouteState).state?.user;
  const [phonenumber, setPhonenumber] = useState(stateUser?.phonenumber || "");
  const [force, setForce] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<unknown | null>(null);
  const [progress, setProgress] = useState<{ walletsGenerated?: number; totalWallets?: number; isComplete?: boolean; status?: string; estimatedCompletionTime?: string } | null>(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    titleCtx?.setTitle("Wallet - Generate by phone");
    titleCtx?.setBreadcrumb([
      "User Management",
      "User Account",
      "Wallet - Generate by phone",
    ]);
  }, [titleCtx]);

  const handleGenerate = async () => {
    try {
      if (!phonenumber) {
        toast.error('Phone number is required');
        return;
      }
      setLoading(true);
      const res = await generateWalletsByPhone(phonenumber, force);
      setStatus(res);
      toast.success(res?.message || 'Started wallet generation');
      // if background in progress, start polling
      if (res?.walletGenerationStatus === 'in_progress' || res?.walletGenerationStatus === 'started') {
        setPolling(true);
      }
    } catch (err) {
      console.error('Generate wallets failed', err);
      toast.error('Failed to start wallet generation');
    } finally {
      setLoading(false);
    }
  };

  // polling effect
  useEffect(() => {
    if (!polling) return;
    const start = Date.now();
    const poll = async () => {
      try {
        const s = await statusByPhone(phonenumber);
        setProgress({
          walletsGenerated: s?.walletsGenerated ?? s?.wallets_generated ?? undefined,
          totalWallets: s?.totalWallets ?? s?.total_wallets ?? undefined,
          isComplete: s?.isComplete ?? s?.is_complete ?? false,
          status: s?.walletGenerationStatus ?? s?.wallet_generation_status,
          estimatedCompletionTime: s?.estimatedCompletionTime ?? s?.estimated_completion_time,
        });
        if (s?.isComplete || s?.is_complete) {
          setPolling(false);
          // stop polling
          if (pollRef.current) window.clearInterval(pollRef.current);
        }
        // safety: stop after 10 minutes
        if (Date.now() - start > 10 * 60 * 1000) {
          setPolling(false);
          if (pollRef.current) window.clearInterval(pollRef.current);
        }
      } catch (err) {
        console.error('poll status error', err);
      }
    };
    // run immediately then interval
    poll();
    pollRef.current = window.setInterval(poll, 3000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [polling, phonenumber]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <Card className="border border-gray-200 shadow-none">
        <CardContent className="py-12 px-6">
          <div className="w-full flex flex-col justify-center items-start gap-8">
            <div className="flex flex-col gap-2 items-start justify-center w-full">
              <Label className="w-full text-gray-800" htmlFor="phonenumber">
                  Phone number
                </Label>
                <Input
                  type="text"
                  name="phonenumber"
                  placeholder="+1234567890"
                  className="w-full h-12 border border-gray-200 shadow-none"
                  required
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
            </div>

            <div className="w-full">
            <div className="w-full space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
                <span className="text-sm">Force regenerate</span>
              </label>
            </div>
            </div>
            
            <Button
              onClick={handleGenerate}
              className="flex h-12 w-full text-white items-center gap-2"
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start generation'}
            </Button>
            {status !== null && <pre className="mt-3 bg-gray-50 p-2 text-xs">{String(JSON.stringify(status, null, 2))}</pre>}
            {progress && (
              <div className="w-full mt-3">
                <div className="text-sm mb-1">Progress: {progress.walletsGenerated ?? 0} / {progress.totalWallets ?? '—'}</div>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div className="h-2 rounded bg-green-600" style={{ width: `${progress.totalWallets ? ((progress.walletsGenerated ?? 0) / (progress.totalWallets || 1)) * 100 : 0}%` }} />
                </div>
                {progress.estimatedCompletionTime && <div className="text-xs text-gray-500 mt-1">ETA: {progress.estimatedCompletionTime}</div>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
        {/* no dialog here - generation runs on this page */}
    </div>
  );
}
