import { useContext, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { CryptoFee } from '../type/fee';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';

export function SearchFee({ initialFee, loading = false, error, viewOnly = false }: { initialFee?: CryptoFee; loading?: boolean; error?: string | null; viewOnly?: boolean } = {}) {
  const titleCtx = useContext(DashboardTitleContext);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(initialFee?.currency ?? '');
  const [selectedNetwork, setSelectedNetwork] = useState<string>(initialFee?.network ?? '');
  const [searchResult, setSearchResult] = useState<CryptoFee | null>(initialFee ?? null);

  useEffect(() => {
    titleCtx?.setTitle('View Specific Fee');
    titleCtx?.setBreadcrumb([
      'Fees & Rates',
      'Crypto Fees',
      'View specific fee',
    ]);
  }, [titleCtx]);

  // auto-search/prefill when initialFee is provided
  useEffect(() => {
    if (initialFee) {
      setSelectedCurrency(initialFee.currency ?? '');
      setSelectedNetwork(initialFee.network ?? '');
      setSearchResult(initialFee);
    }
  }, [initialFee]);

  // TODO: Replace with actual data from your API
  const currencies = ['BTC', 'ETH', 'USDT'];
  const networks = ['Bitcoin', 'Ethereum', 'Tron'];

  const handleSearch = () => {
    // TODO: Implement actual search functionality
    // This is mock data for demonstration
    if (selectedCurrency && selectedNetwork) {
      const mockResult: CryptoFee = {
        currency: selectedCurrency,
        network: selectedNetwork,
        networkName: `${selectedNetwork} Network`,
        networkFee: 0.001,
      };
      setSearchResult(mockResult);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <Card className='border border-gray-200 shadow-none'>
        <CardContent className="py-6 px-4">
          <div className="w-full py-8 flex flex-col justify-center items-start gap-8">
            {viewOnly ? (
              <div className="w-full py-6 border border-gray-200 rounded px-3">{selectedCurrency || '-'}</div>
            ) : (
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className='w-full border border-gray-300 py-6'>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className='w-full border border-gray-300 bg-white'>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {viewOnly ? (
              <div className="w-full py-6 border border-gray-200 rounded px-3">{selectedNetwork || '-'}</div>
            ) : (
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className='w-full border border-gray-300 py-6'>
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent className='w-full bg-white border border-gray-300'>
                  {networks.map((network) => (
                    <SelectItem key={network} value={network}>
                      {network}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {!viewOnly && (
              <Button onClick={handleSearch} className="flex h-12 w-full text-white items-center gap-2" disabled={loading}>
                <Search className="h-4 w-4" />
                {loading ? 'Loading…' : 'Search Fee'}
              </Button>
            )}
            {viewOnly && loading && (
              <div className="text-sm text-gray-500">Loading fee…</div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-50 border-red-200 shadow-none">
          <CardContent className="pt-4">
            <div className="text-sm text-red-700">{error}</div>
          </CardContent>
        </Card>
      )}

      {searchResult && (
        <Card className="bg-green-100 border-green-300 shadow-none">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Fee Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Currency:</span>
                <span>{searchResult.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Network:</span>
                <span>{searchResult.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Network Name:</span>
                <span>{searchResult.networkName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fee:</span>
                <span>{searchResult.networkFee}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
