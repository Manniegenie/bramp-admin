import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { fetchCryptoFees } from '../store/cryptoFeeSlice';
import { fetchOnramp, setOnramp as setOnrampThunk, fetchOfframp, setOfframp as setOfframpThunk } from '../store/ngnMarkupSlice';
import type { AppDispatch, RootState } from '@/core/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function FeesAndRates() {
  const dispatch = useDispatch<AppDispatch>();
  const { fees, loading, error } = useSelector((state: RootState) => state.cryptoFee);
  const ngn = useSelector((state: RootState) => state.ngnMarkup);
  const titleCtx = useContext(DashboardTitleContext);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    currency: '',
    network: ''
  });
  
  // Active filters for display
  const [activeFilters, setActiveFilters] = useState(filters);
  const [filteredFees, setFilteredFees] = useState(fees || []);

  // Count active filters
  const activeFilterCount = Object.entries(activeFilters)
    .filter(([, value]) => value !== '')
    .length;

  // Onramp and Offramp states
  const [onrampRate, setOnrampRate] = useState<number | null>(null);
  const [onrampUpdatedAt, setOnrampUpdatedAt] = useState<string | null>(null);
  const [onrampInput, setOnrampInput] = useState<string>('');
  const [onrampLoading, setOnrampLoading] = useState(false);

  const [offrampRate, setOfframpRate] = useState<number | null>(null);
  const [offrampUpdatedAt, setOfframpUpdatedAt] = useState<string | null>(null);
  const [offrampInput, setOfframpInput] = useState<string>('');
  const [offrampLoading, setOfframpLoading] = useState(false);


  useEffect(() => {
    titleCtx?.setTitle('Fees & Rates');
    titleCtx?.setBreadcrumb([
      'Fees & Rates',
      'Crypto Fees',
      'View all fees & rates',
    ]);
    
    dispatch(fetchCryptoFees());
    dispatch(fetchOnramp());
    dispatch(fetchOfframp());
  }, [dispatch]);

  // sync local derived state from the store
  useEffect(() => {
    setOnrampRate(ngn.onramp?.rate ?? null);
    setOnrampUpdatedAt(ngn.onramp?.updatedAt ?? null);
    setOfframpRate(ngn.offramp?.rate ?? null);
    setOfframpUpdatedAt(ngn.offramp?.updatedAt ?? null);
  }, [ngn.onramp, ngn.offramp]);

  // Update filtered fees when fees or filters change
  useEffect(() => {
    if (!fees) return;
    
    let filtered = fees;
    
    if (activeFilters.searchTerm) {
      const searchTerm = activeFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.currency?.toLowerCase().includes(searchTerm) ||
        fee.network?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (activeFilters.currency) {
      filtered = filtered.filter(fee => fee.currency === activeFilters.currency);
    }
    
    if (activeFilters.network) {
      filtered = filtered.filter(fee => fee.network === activeFilters.network);
    }
    
    setFilteredFees(filtered);
  }, [fees, activeFilters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = () => {
    setActiveFilters(filters);
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      currency: '',
      network: ''
    };
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  };

  // Remove individual filter
  const removeFilter = (key: string) => {
    const newFilters = {
      ...activeFilters, 
      [key]: '' 
    };
    setFilters(newFilters);
    setActiveFilters(newFilters);
  };

  // Helper function to format date
  function formatDate(d?: string | null) {
    try {
      return d ? new Date(d).toLocaleString() : '—';
    } catch {
      return '—';
    }
  }

  // Onramp functions
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

  // Offramp functions
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


  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
      <Tabs defaultValue="crypto-fees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="crypto-fees">Crypto Fees</TabsTrigger>
          <TabsTrigger value="onramp-rate">Onramp Rate</TabsTrigger>
          <TabsTrigger value="offramp-rate">Offramp Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto-fees" className="mt-6">
          <Card className="w-full bg-white rounded p-4">
            {/* Search and Filters */}
            <div className="w-full mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search fees by currency, network..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  Search
                </Button>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant={showFilters ? "secondary" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 border-red-300"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={filters.currency}
                        onChange={(e) => handleFilterChange('currency', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">All currencies</option>
                        {Array.from(new Set(fees?.map(fee => fee.currency).filter(Boolean))).map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>

                    {/* Network */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                      <select
                        value={filters.network}
                        onChange={(e) => handleFilterChange('network', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">All networks</option>
                        {Array.from(new Set(fees?.map(fee => fee.network).filter(Boolean))).map(network => (
                          <option key={network} value={network}>{network}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handleSearch}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {activeFilterCount > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(activeFilters).map(([key, value]) => {
                    if (!value) return null;
                    
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                        <button
                          onClick={() => removeFilter(key)}
                          className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Data Table */}
            {loading ? (
              <div className="flex items-center justify-center w-full h-32">
                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center w-full h-32 text-red-500">
                {error}
              </div>
            ) : (
              <DataTable columns={columns} data={filteredFees} />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="onramp-rate" className="mt-6">
          <div className="w-full max-w-3xl mx-auto">
            <Card className="w-full border-none shadow-none">
              <CardContent className="py-6 px-4 flex justify-center">
                <div className="w-full">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offramp-rate" className="mt-6">
          <div className="w-full max-w-3xl mx-auto">
            <Card className="w-full border-none shadow-none">
              <CardContent className="py-6 px-4 flex justify-center">
                <div className="w-full">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}