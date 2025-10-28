import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DashboardTitleContext } from "@/layouts/DashboardTitleContext";
import { fetchCryptoFees } from "../store/cryptoFeeSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit3, User2Icon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { fetchGlobalMarkdown, setGlobalMarkdown, toggleGlobalMarkdown, calculatePrice } from '@/features/fees/store/assetMarkdownSlice';
import type { RootState, AppDispatch } from '@/core/store/store';

export function PriceCalculator() {
  const dispatch = useDispatch<AppDispatch>();
  const assetState = useSelector((state: RootState) => state.assetMarkdown);
  const titleCtx = useContext(DashboardTitleContext);

  const [markdownInput, setMarkdownInput] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [toggleLoading, setToggleLoading] = useState(false);

  const [calcOriginal, setCalcOriginal] = useState<string>('');
  const [calcAsset, setCalcAsset] = useState<string>('');

  useEffect(() => {
    titleCtx?.setTitle("Price Calculator");
    titleCtx?.setBreadcrumb([
      "Fees & Rates",
      "Global Adjustments",
      "Price calculator",
    ]);

    dispatch(fetchCryptoFees());
    // fetch global markdown details
    dispatch(fetchGlobalMarkdown());
  }, [dispatch, titleCtx]);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <Card className="w-full border-none shadow-none">
        <CardContent className="py-6 px-4 flex justify-center">
          <Tabs
            defaultValue="ngn-markup"
            className="w-full flex justify-center items-center"
          >
            <TabsList className="bg-gray-100 p-2 rounded-full h-fit">
              <TabsTrigger
                value="ngn-markup"
                className="py-3 rounded-full px-3"
              >
                Price Calculator
              </TabsTrigger>
              <TabsTrigger
                value="on-ramp-rate"
                className="py-3 rounded-full px-3"
              >
                Global Asset
              </TabsTrigger>
              <TabsTrigger
                value="off-ramp-rate"
                className="py-3 rounded-full px-3"
              >
                Global Swap
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ngn-markup" className="border border-gray-200 shadow-none p-8 rounded w-full">
              <div className="flex flex-col gap-0 mb-6">
                <Label className="text-gray-500">Original Price</Label>
                <NumberInput value={calcOriginal} onChange={(e) => setCalcOriginal(e.target.value)} allowDecimal placeholder="N0" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-col gap-0 mb-4">
                <Label className="text-gray-500">Asset Label</Label>
                <Input value={calcAsset} onChange={(e) => setCalcAsset(e.target.value)} placeholder="Bitcoin" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                {assetState.lastCalculation ? (
                  <>
                    <div className="flex justify-between mb-2 text-sm font-medium text-primary">
                      <span>Price Calculation Result - {assetState.lastCalculation.asset}</span>
                      <span className="text-xs">Calculated at {new Date(assetState.lastCalculation.calculatedAt ?? '').toLocaleString()}</span>
                    </div>
                    <div className="border-b border-green-300 py-4 text-xs flex items-center justify-between">
                      <div className="w-1/3 flex flex-col justify-between gap-6 text-gray-600">
                        <div className="w-full flex justify-between">
                          <span>Original Price:</span>
                          <span>N{Number(assetState.lastCalculation.originalPrice).toLocaleString()}</span>
                        </div>
                        <div className="w-full flex justify-between">
                          <span>Discounted Amount:</span>
                          <span>-N{Number(assetState.lastCalculation.discountAmount).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="w-1/3 flex flex-col justify-between gap-6 text-gray-600">
                        <div className="w-full flex justify-between">
                          <span>Markdown %:</span>
                          <span>{assetState.lastCalculation.formattedPercentage ?? `${assetState.lastCalculation.markdownPercentage}%`}</span>
                        </div>
                        <div className="w-full flex justify-between">
                          <span>Status:</span>
                          <span>{assetState.lastCalculation.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-between mt-4 text-sm font-semibold text-black">
                      <span>Discounted price</span>
                      <span>N{Number(assetState.lastCalculation.discountedPrice).toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600">No calculation yet. Enter values and click Calculate.</div>
                )}
              </div>
              <Button className="mt-6 bg-primary hover:bg-primary/90 text-white" onClick={async () => {
                if (!calcOriginal) return toast.error('Provide an amount');
                if (!calcAsset) return toast.error('Provide an asset label');
                const value = Number(calcOriginal);
                if (!Number.isFinite(value) || value <= 0) return toast.error('Invalid amount');
                try {
                  await dispatch(calculatePrice({ originalPrice: value, asset: calcAsset })).unwrap();
                  toast.success('Price calculated');
                } catch (err: unknown) {
                  const msg = err instanceof Error ? err.message : String(err);
                  toast.error(msg || 'Failed to calculate');
                }
              }}>{assetState.loading ? 'Calculating...' : 'Calculate'}</Button>
            </TabsContent>
            <TabsContent value="on-ramp-rate" className="border border-gray-200 shadow-none p-8 rounded w-full">
              <div className="bg-primary relative rounded-lg p-6 w-full text-white flex justify-center gap-6 mb-6">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs text-white/87">Current Markdown</span>
                  <span className="text-4xl font-semibold">N{assetState.global ? Number((assetState.global.markdownPercentage ?? 0)).toLocaleString() : '—'}</span>
                  <span className="text-[11px] text-white/87">{assetState.global?.description ?? ''}</span>
                  <span className="text-[11px] text-white/87">Last Update: {assetState.global?.updatedAt ? new Date(assetState.global.updatedAt).toLocaleString() : '—'}</span>
                </div>
                <div className="w-fit text-[11px] flex flex-col justify-between items-end text-[11px]">
                  <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary text-[11px]">
                    {assetState.global?.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-white/87 flex items-center gap-1">
                    <User2Icon className="h-3 w-3" /> {assetState.global?.updatedBy ?? '—'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-500">Markdown percentage (0-100)</Label>
                <NumberInput value={markdownInput} onChange={(e) => setMarkdownInput(e.target.value)} allowDecimal placeholder="12.5" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded" />
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-gray-500">Description/Notes</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="" className="w-full mt-2 p-3 h-10 border border-gray-300 rounded"></Textarea>
                <span className="text-gray-500 text-[11px]">Affects all assets system-wide</span>
              </div>
              <div className="flex gap-2">
                <Button variant='default' className="flex-1 bg-primary h-10 text-white" onClick={async () => {
                  if (!markdownInput) return toast.error('Provide a markdown percentage');
                  const num = Number(markdownInput);
                  if (!Number.isFinite(num) || num < 0 || num > 100) return toast.error('Invalid percentage');
                  try {
                    const payload = await dispatch(setGlobalMarkdown({ markdownPercentage: num, description })).unwrap();
                    if (payload?.success) {
                      toast.success(payload.message || 'Markdown updated');
                      setMarkdownInput('');
                      setDescription('');
                      dispatch(fetchGlobalMarkdown());
                    } else {
                      toast.error(payload?.message || 'Failed to update');
                    }
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err);
                    toast.error(msg || 'Failed to update');
                  }
                }}>{assetState.loading ? 'Updating...' : 'Update markdown'}</Button>
                <Button variant='ghost' className="w-36" onClick={async () => {
                  setToggleLoading(true);
                  try {
                    const payload = await dispatch(toggleGlobalMarkdown({})).unwrap();
                    if (payload?.success) {
                      toast.success(payload.message || 'Toggled');
                      dispatch(fetchGlobalMarkdown());
                    } else {
                      toast.error(payload?.message || 'Failed to toggle');
                    }
                  } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : String(err);
                    toast.error(msg || 'Failed to toggle');
                  } finally {
                    setToggleLoading(false);
                  }
                }}>{toggleLoading ? '...' : assetState.global?.isActive ? 'Disable' : 'Enable'}</Button>
              </div>
            </TabsContent>
            <TabsContent
              value="off-ramp-rate"
              className="w-full"
            >
              <div className="border border-gray-200 shadow-none p-8 rounded mb-4">
                <div className="bg-primary relative rounded-lg p-6 w-full text-white flex justify-center gap-6 mb-6">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-xs text-white/87">
                      Current Markdown
                    </span>
                    <span className="text-4xl font-semibold">N0</span>
                    <span className="text-[11px] text-white/87">
                      Last Update: 12-10-2399 12:22:12
                    </span>
                  </div>
                  <div className="w-fit text-[11px] flex flex-col justify-between items-end">
                    <div className="w-fit h-fit flex items-center gap-2 text-[11px]">
                      <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary flex items-center gap-2">
                        <Edit3 className="h-3 w-3" /> Edit
                      </div>
                      <div className="w-fit h-fit py-1 px-3 rounded-full bg-white/50 text-primary flex items-center gap-2">
                        Active <Input type="checkbox" className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="text-xs text-white/87 flex items-center gap-1">
                      <User2Icon className="h-3 w-3" /> Mannie@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <Label className="text-gray-500">
                    Markdown percentage (0-100)
                  </Label>
                  <NumberInput
                    allowDecimal={true}
                    placeholder="12.5"
                    className="w-full mt-2 p-3 h-10 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <Label className="text-gray-500">Description/Notes</Label>
                  <Textarea
                    placeholder=""
                    className="w-full mt-2 p-3 h-10 border border-gray-300 rounded"
                  ></Textarea>
                  <span className="text-gray-500 text-[11px]">
                    Affects all assets system-wide
                  </span>
                </div>
                <Button
                  variant="default"
                  className="w-full bg-primary h-10 text-white"
                >
                  Update markdown
                </Button>
              </div>
              <div className="border border-gray-200 shadow-none p-8 rounded">
                <h4 className="text-base font-semibold pb-6">Test / Apply Markdown</h4>
                <div className="flex flex-col gap-0 mb-6">
                  <Label className="text-gray-500">Amount</Label>
                  <Input
                    placeholder="Enter amount"
                    className="w-full mt-2 p-3 h-10 border border-gray-300 rounded"
                  />
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <div className="flex justify-between mb-2 text-sm font-medium text-primary">
                    <span>Result</span>
                  </div>
                  <div className="border-b border-green-300 py-4 text-xs flex flex-col gap-6 items-center justify-between">
                    <div className="w-full flex justify-between">
                      <span>Original Price:</span>
                      <span>N1,000.00</span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Mark-Down Amount:</span>
                      <span>N850.00</span>
                    </div>
                  </div>
                  <div className="w-full flex justify-between mt-4 text-sm font-semibold text-black">
                    <span>Reduction:</span>
                    <span>-N875.00</span>
                  </div>
                </div>
                <Button className="w-full mt-6 h-10 bg-primary hover:bg-primary/90 text-white">
                  Apply Markdown
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
