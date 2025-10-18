import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardTitleContext } from "@/layouts/DashboardTitleContext";
import { fetchCryptoFees } from "../store/cryptoFeeSlice";
import { fetchNgnMarkup, updateNgnMarkup, fetchOnramp, setOnramp as setOnrampThunk, fetchOfframp, setOfframp as setOfframpThunk } from '../store/ngnMarkupSlice';
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
  const [markup, setMarkup] = useState<number | null>(1530);
  const [markupInput, setMarkupInput] = useState<string>('');
  const [markupLoading, setMarkupLoading] = useState(false);

  const [onrampRate, setOnrampRate] = useState<number | null>(null);
  const [onrampUpdatedAt, setOnrampUpdatedAt] = useState<string | null>(null);
  const [onrampInput, setOnrampInput] = useState<string>('');
  const [onrampLoading, setOnrampLoading] = useState(false);

  const [offrampRate, setOfframpRate] = useState<number | null>(null);
  const [offrampUpdatedAt, setOfframpUpdatedAt] = useState<string | null>(null);
  const [offrampInput, setOfframpInput] = useState<string>('');
  const [offrampLoading, setOfframpLoading] = useState(false);

  useEffect(() => {
    titleCtx?.setTitle("NGN Markup");
    titleCtx?.setBreadcrumb(["Fees & Rates", "NGN Rates", "NGN markup"]);
    // load initial data and fetch rates via thunks
    dispatch(fetchCryptoFees());
    dispatch(fetchNgnMarkup());
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
  setMarkup(ngn.markup?.markup ?? null);
    setOnrampRate(ngn.onramp?.rate ?? null);
    setOnrampUpdatedAt(ngn.onramp?.updatedAt ?? null);
    setOfframpRate(ngn.offramp?.rate ?? null);
    setOfframpUpdatedAt(ngn.offramp?.updatedAt ?? null);
  }, [ngn.markup, ngn.onramp, ngn.offramp]);

  async function updateMarkup() {
    if (!markupInput) return toast.error('Provide a markup');
    const value = Number(markupInput);
    if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid markup');
    setMarkupLoading(true);
    try {
      const payload = await dispatch(updateNgnMarkup(value)).unwrap();
      if (payload?.success) {
        toast.success(payload.message || 'Markup updated');
        setMarkupInput('');
        // refresh from server after success
        dispatch(fetchNgnMarkup());
      } else {
        toast.error(payload?.message || 'Failed to update markup');
      }
    } catch (err: unknown) {
      console.error('update markup failed', err);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'Failed to update markup');
    } finally {
      setMarkupLoading(false);
    }
  }


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
          <Tabs defaultValue="ngn-markup" className="w-full flex justify-center items-center">
            <TabsList className="bg-gray-100 p-2 rounded-full h-fit">
              <TabsTrigger value="ngn-markup" className="py-3 rounded-full px-3">NGN Markup</TabsTrigger>
              <TabsTrigger value="on-ramp-rate" className="py-3 rounded-full px-3">On-Ramp Rate</TabsTrigger>
              <TabsTrigger value="off-ramp-rate" className="py-3 rounded-full px-3">Off-Ramp Rate</TabsTrigger>
            </TabsList>
            <TabsContent value="ngn-markup" className="border border-gray-200 shadow-none p-8 rounded w-full">
              <div className="bg-primary rounded-lg p-6 w-full text-white flex flex-col justify-center gap-6 mb-6">
                <span className="text-xs text-white/87">Current Markup</span>
                <span className="text-4xl font-semibold">N{markup ? Number(markup).toLocaleString() : '—'}</span>
                <span className="text-xs text-white/87">Applied globally to pricing calculations</span>
                {/* <span className="text-xs text-white/87">Last Update: {formatDate(markupUpdatedAt)}</span> */}
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-800">New Markup (N)</Label>
                <NumberInput value={markupInput} onChange={(e) => setMarkupInput(e.target.value)} allowDecimal={false} placeholder="N0" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
                <span className="text-gray-800 text-xs">Applied globally to pricing calculations</span>
              </div>
              <Button variant='default' className="w-full bg-primary h-10 text-white" onClick={updateMarkup} disabled={markupLoading}>{markupLoading ? 'Updating...' : 'Update Markup'}</Button>
            </TabsContent>
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
