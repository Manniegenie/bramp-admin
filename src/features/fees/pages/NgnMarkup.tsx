import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitleContext } from "@/layouts/DashboardTitleContext";
import { fetchCryptoFees } from "../store/cryptoFeeSlice";
import { fetchOnramp, setOnramp as setOnrampThunk, fetchOfframp, setOfframp as setOfframpThunk } from '../store/ngnMarkupSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '@/core/store/store';
import type { AppDispatch } from "@/core/store/store";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export function NgnMarkup() {
  const dispatch = useDispatch<AppDispatch>();
  const titleCtx = useContext(DashboardTitleContext);
  const ngn = useSelector((s: RootState) => s.ngnMarkup);

  const [onrampRate, setOnrampRate] = useState<number | null>(null);
  const [onrampUpdatedAt, setOnrampUpdatedAt] = useState<string | null>(null);
  const [onrampInput, setOnrampInput] = useState<string>('');
  const [onrampLoading, setOnrampLoading] = useState(false);

  const [offrampRate, setOfframpRate] = useState<number | null>(null);
  const [offrampUpdatedAt, setOfframpUpdatedAt] = useState<string | null>(null);
  const [offrampInput, setOfframpInput] = useState<string>('');
  const [offrampLoading, setOfframpLoading] = useState(false);

  useEffect(() => {
    titleCtx?.setTitle("NGN Rates");
    titleCtx?.setBreadcrumb(["Fees & Rates", "NGN Rates"]);
    // load initial data and fetch rates via thunks
    dispatch(fetchCryptoFees());
    dispatch(fetchOnramp());
    dispatch(fetchOfframp());
  }, [dispatch, titleCtx]);

  function formatDate(d?: string | null) {
    try {
      return d ? new Date(d).toLocaleString() : '—';
    } catch {
      return '—';
    }
  }

  // sync local derived state from the store
  useEffect(() => {
    setOnrampRate(ngn.onramp?.rate ?? null);
    setOnrampUpdatedAt(ngn.onramp?.updatedAt ?? null);
    setOfframpRate(ngn.offramp?.rate ?? null);
    setOfframpUpdatedAt(ngn.offramp?.updatedAt ?? null);
  }, [ngn.onramp, ngn.offramp]);



  async function setOnramp() {
    if (!onrampInput) return toast.error('Provide a rate');
    const value = Number(onrampInput);
    if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid rate');
    setOnrampLoading(true);
    try {
      const payload = await dispatch(setOnrampThunk(value)).unwrap();
      if (payload?.success) {
        toast.success(payload.message || 'Onramp rate set');
        setOnrampInput('');
        dispatch(fetchOnramp());
      } else {
        toast.error(payload?.message || 'Failed to set onramp rate');
      }
    } catch (err) {
      console.error('set onramp failed', err);
      toast.error('Failed to set onramp rate');
    } finally {
      setOnrampLoading(false);
    }
  }

  

  async function setOfframp() {
    if (!offrampInput) return toast.error('Provide a rate');
    const value = Number(offrampInput);
    if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid rate');
    setOfframpLoading(true);
    try {
      const payload = await dispatch(setOfframpThunk(value)).unwrap();
      if (payload?.success) {
        toast.success(payload.message || 'Offramp rate set');
        setOfframpInput('');
        dispatch(fetchOfframp());
      } else {
        toast.error(payload?.message || 'Failed to set offramp rate');
      }
    } catch (err) {
      console.error('set offramp failed', err);
      toast.error('Failed to set offramp rate');
    } finally {
      setOfframpLoading(false);
    }
  }

  // (initial fetches and store-syncing are handled in the top-level effects)

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      <Card className="w-full border-none shadow-none">
        <CardContent className="py-6 px-4 flex justify-center">
          <Tabs defaultValue="on-ramp-rate" className="w-full flex justify-center items-center">
            <TabsList className="bg-gray-100 p-2 rounded-full h-fit">
              <TabsTrigger value="on-ramp-rate" className="py-3 rounded-full px-3">On-Ramp Rate</TabsTrigger>
              <TabsTrigger value="off-ramp-rate" className="py-3 rounded-full px-3">Off-Ramp Rate</TabsTrigger>
            </TabsList>
            <TabsContent value="on-ramp-rate"  className="border border-gray-200 shadow-none p-8 rounded w-full">
              <div className="bg-primary relative rounded-lg p-6 w-full text-white flex flex-col justify-center gap-6 mb-6">
                <span className="text-xs text-white/87">Current On-Ramp Rate</span>
                <span className="text-4xl font-semibold">N{onrampRate ? Number(onrampRate).toLocaleString() : '—'}</span>
                <span className="text-xs text-white/87">Last Update: {formatDate(onrampUpdatedAt)}</span>
                <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary absolute top-5 right-5 text-[11px]">Source: Manual</div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-800">New Rate (N per unit)</Label>
                <NumberInput value={onrampInput} onChange={(e) => setOnrampInput(e.target.value)} allowDecimal={true} placeholder="N0" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
                <span className="text-gray-800 text-xs">Positive number only</span>
              </div>
              <Button variant='default' className="w-full bg-primary h-10 text-white" onClick={setOnramp} disabled={onrampLoading}>{onrampLoading ? 'Updating...' : 'Update Rate'}</Button>
            </TabsContent>
            <TabsContent value="off-ramp-rate"  className="border border-gray-200 shadow-none p-8 rounded w-full">
              <div className="bg-primary relative rounded-lg p-6 w-full text-white flex flex-col justify-center gap-6 mb-6">
                <span className="text-xs text-white/87">Current Off-Ramp Rate</span>
                <span className="text-4xl font-semibold">N{offrampRate ? Number(offrampRate).toLocaleString() : '—'}</span>
                <span className="text-xs text-white/87">Last Update: {formatDate(offrampUpdatedAt)}</span>
                <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary absolute top-5 right-5 text-[11px]">Source: Manual</div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-800">New Rate (N per unit)</Label>
                <NumberInput value={offrampInput} onChange={(e) => setOfframpInput(e.target.value)} allowDecimal={true} placeholder="N0" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
                <span className="text-gray-800 text-xs">Positive number only</span>
              </div>
              <Button variant='default' className="w-full bg-primary h-10 text-white" onClick={setOfframp} disabled={offrampLoading}>{offrampLoading ? 'Updating...' : 'Update Rate'}</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
