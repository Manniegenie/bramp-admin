import { useContext, useEffect, useState, useMemo } from 'react';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/core/store/store';
import { fetchUsers } from '../store/usersSlice';
import { columns } from '../components/columns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

export function UserList() {
  const titleCtx = useContext(DashboardTitleContext);
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const pagination = useSelector((state: RootState) => state.users.pagination);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    kycLevel: '',
    emailVerified: '',
    bvnVerified: '',
    dateFrom: '',
    dateTo: '',
    limit: '10'
  });
  
  // Active filters for display
  const [activeFilters, setActiveFilters] = useState(filters);
  const [skip, setSkip] = useState<number>(0);

  const total = pagination?.total ?? 0;
  const limit = Number(activeFilters.limit);
  const currentPage = useMemo(() => Math.floor((pagination?.skip ?? skip) / limit) + 1, [pagination, skip, limit]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Count active filters (excluding limit)
  const activeFilterCount = Object.entries(activeFilters)
    .filter(([key, value]) => key !== 'limit' && value !== '')
    .length;

  useEffect(() => {
    titleCtx?.setTitle('User Management');
  }, [titleCtx]);

  // Initial load with latest users
  useEffect(() => {
    dispatch(fetchUsers({ limit: 10, skip: 0, sort: '-createdAt' }));
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = () => {
    const params: Record<string, string | number | boolean> = { 
      limit: Number(filters.limit), 
      skip: 0,
      sort: '-createdAt' // Always sort by latest
    };
    
    if (filters.searchTerm) params.q = filters.searchTerm;
    if (filters.kycLevel) params.kycLevel = Number(filters.kycLevel);
    if (filters.emailVerified) params.emailVerified = filters.emailVerified === 'true';
    if (filters.bvnVerified) params.bvnVerified = filters.bvnVerified === 'true';
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    setActiveFilters(filters);
    setSkip(0);
    dispatch(fetchUsers(params));
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      kycLevel: '',
      emailVerified: '',
      bvnVerified: '',
      dateFrom: '',
      dateTo: '',
      limit: '10'
    };
    setFilters(defaultFilters);
    setActiveFilters(defaultFilters);
    setSkip(0);
    dispatch(fetchUsers({ limit: 10, skip: 0, sort: '-createdAt' }));
  };

  // Remove individual filter
  const removeFilter = (key: string) => {
    const newFilters = {
      ...activeFilters, 
      [key]: '' 
    };
    setFilters(newFilters);
    setActiveFilters(newFilters);
    setSkip(0);
    
    const params: Record<string, string | number | boolean> = { 
      limit: Number(newFilters.limit), 
      skip: 0,
      sort: '-createdAt'
    };
    
    if (newFilters.searchTerm) params.q = newFilters.searchTerm;
    if (newFilters.kycLevel) params.kycLevel = Number(newFilters.kycLevel);
    if (newFilters.emailVerified) params.emailVerified = newFilters.emailVerified === 'true';
    if (newFilters.bvnVerified) params.bvnVerified = newFilters.bvnVerified === 'true';
    if (newFilters.dateFrom) params.dateFrom = newFilters.dateFrom;
    if (newFilters.dateTo) params.dateTo = newFilters.dateTo;

    dispatch(fetchUsers(params));
  };

  // Handle pagination
  const handlePageChange = (newSkip: number) => {
    setSkip(newSkip);
    const params: Record<string, string | number | boolean> = { 
      limit: Number(activeFilters.limit), 
      skip: newSkip,
      sort: '-createdAt'
    };
    
    if (activeFilters.searchTerm) params.q = activeFilters.searchTerm;
    if (activeFilters.kycLevel) params.kycLevel = Number(activeFilters.kycLevel);
    if (activeFilters.emailVerified) params.emailVerified = activeFilters.emailVerified === 'true';
    if (activeFilters.bvnVerified) params.bvnVerified = activeFilters.bvnVerified === 'true';
    if (activeFilters.dateFrom) params.dateFrom = activeFilters.dateFrom;
    if (activeFilters.dateTo) params.dateTo = activeFilters.dateTo;

    dispatch(fetchUsers(params));
  };

  return (
    <div className="space-y-6 p-4">
      <Card className="w-full bg-white rounded p-4">
        {/* Search and Filters */}
        <div className="w-full mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by email, name..."
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
                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* KYC Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KYC Level</label>
                  <select
                    value={filters.kycLevel}
                    onChange={(e) => handleFilterChange('kycLevel', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All KYC levels</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>

                {/* Email Verified */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Verified</label>
                  <select
                    value={filters.emailVerified}
                    onChange={(e) => handleFilterChange('emailVerified', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Any verification</option>
                    <option value="true">Email verified</option>
                    <option value="false">Email not verified</option>
                  </select>
                </div>

                {/* BVN Verified */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BVN Verified</label>
                  <select
                    value={filters.bvnVerified}
                    onChange={(e) => handleFilterChange('bvnVerified', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Any BVN status</option>
                    <option value="true">BVN verified</option>
                    <option value="false">BVN not verified</option>
                  </select>
                </div>

                {/* Page Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
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
                if (key === 'limit' || !value) return null;
                
                let displayValue = value;
                if (key === 'emailVerified' || key === 'bvnVerified') {
                  displayValue = value === 'true' ? 'Yes' : 'No';
                }
                
                return (
                  <div
                    key={key}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    <span className="font-medium">{key}:</span>
                    <span>{displayValue}</span>
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
        ) : (
          <DataTable columns={columns} data={users} />
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                aria-label="Previous page" 
                className="px-3 py-1 border border-gray-200 bg-gray-100 rounded" 
                disabled={currentPage <= 1} 
                onClick={() => handlePageChange(Math.max(0, (currentPage - 2) * limit))}
              >
                Prev
              </Button>
            </div>
            <div className="text-sm font-medium">
              <nav aria-label="Pagination" className="flex items-center gap-1">
                {(() => {
                  const pages: Array<number | string> = [];
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    const left = Math.max(2, currentPage - 1);
                    const right = Math.min(totalPages - 1, currentPage + 1);
                    pages.push(1);
                    if (left > 2) pages.push('...');
                    for (let i = left; i <= right; i++) pages.push(i);
                    if (right < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                  }

                  return pages.map((p, idx) => {
                    if (p === '...') return (
                      <span key={`el-${idx}`} className="px-2">…</span>
                    );
                    const page = p as number;
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => handlePageChange((page - 1) * limit)}
                        className={`px-3 py-1 border rounded ${isActive ? 'bg-green-600 text-white' : ''}`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}
              </nav>
            </div>
            <div>
              <Button 
                aria-label="Next page" 
                className="px-3 py-1 border border-gray-200 bg-gray-100 rounded" 
                disabled={currentPage >= totalPages} 
                onClick={() => handlePageChange(currentPage * limit)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}