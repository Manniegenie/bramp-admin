import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { fetchCryptoFees } from '../store/cryptoFeeSlice';
import type { AppDispatch, RootState } from '@/core/store/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

export function FeesAndRates() {
  const dispatch = useDispatch<AppDispatch>();
  const { fees, loading, error } = useSelector((state: RootState) => state.cryptoFee);
  const titleCtx = useContext(DashboardTitleContext);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    currency: '',
    network: '',
    feeType: ''
  });
  
  // Active filters for display
  const [activeFilters, setActiveFilters] = useState(filters);
  const [filteredFees, setFilteredFees] = useState(fees || []);

  // Count active filters
  const activeFilterCount = Object.entries(activeFilters)
    .filter(([key, value]) => value !== '')
    .length;


  useEffect(() => {
    titleCtx?.setTitle('Fees & Rates');
    titleCtx?.setBreadcrumb([
      'Fees & Rates',
      'Crypto Fees',
      'View all fees & rates',
    ]);
    
    dispatch(fetchCryptoFees());
  }, [dispatch]);

  // Update filtered fees when fees or filters change
  useEffect(() => {
    if (!fees) return;
    
    let filtered = fees;
    
    if (activeFilters.searchTerm) {
      const searchTerm = activeFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(fee => 
        fee.currency?.toLowerCase().includes(searchTerm) ||
        fee.network?.toLowerCase().includes(searchTerm) ||
        fee.feeType?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (activeFilters.currency) {
      filtered = filtered.filter(fee => fee.currency === activeFilters.currency);
    }
    
    if (activeFilters.network) {
      filtered = filtered.filter(fee => fee.network === activeFilters.network);
    }
    
    if (activeFilters.feeType) {
      filtered = filtered.filter(fee => fee.feeType === activeFilters.feeType);
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
      network: '',
      feeType: ''
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


  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select
                    value={filters.feeType}
                    onChange={(e) => handleFilterChange('feeType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All fee types</option>
                    {Array.from(new Set(fees?.map(fee => fee.feeType).filter(Boolean))).map(feeType => (
                      <option key={feeType} value={feeType}>{feeType}</option>
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
    </div>
  );
}