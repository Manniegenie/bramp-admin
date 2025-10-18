import { useContext, useEffect, useState, useMemo } from 'react';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/core/store/store';
import { fetchUsers } from '../store/usersSlice';
import { columns } from '../components/columns';
import { Button } from '@/components/ui/button';

export function UserList() {
  const titleCtx = useContext(DashboardTitleContext);
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.users);
  const pagination = useSelector((state: RootState) => state.users.pagination);

  // Filter / pagination local state
  const [search] = useState('');
  const [kycLevel] = useState<string | ''>('');
  const [emailVerified] = useState<string | ''>('');
  const [limit] = useState<number>(10);
  const [skip, setSkip] = useState<number>(0);

  const total = pagination?.total ?? 0;
  const currentPage = useMemo(() => Math.floor((pagination?.skip ?? skip) / limit) + 1, [pagination, skip, limit]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    titleCtx?.setTitle('User Management');
  }, [titleCtx]);

  // Fetch when filters change
  useEffect(() => {
    const params: Record<string, string | number | boolean> = { limit, skip };
    if (search) params.q = search;
    if (kycLevel !== '') params.kycLevel = Number(kycLevel);
    if (emailVerified !== '') params.emailVerified = emailVerified === 'true';
    dispatch(fetchUsers(params));
  }, [dispatch, limit, skip, search, kycLevel, emailVerified]);

  return (
    <div className="space-y-6 p-4">
      <div className="w-full bg-white rounded p-4">
        {/* <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name"
              className="border rounded px-3 py-2"
            />
            <select aria-label="KYC level" value={kycLevel} onChange={(e) => setKycLevel(e.target.value)} className="border rounded px-2 py-2">
              <option value="">All KYC levels</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <select aria-label="Email verified" value={emailVerified} onChange={(e) => setEmailVerified(e.target.value)} className="border rounded px-2 py-2">
              <option value="">Any verification</option>
              <option value="true">Email verified</option>
              <option value="false">Email not verified</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Page size</label>
            <select aria-label="Page size" value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setSkip(0); }} className="border rounded px-2 py-2">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div> */}
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Button aria-label="Previous page" className="px-3 py-1 border border-gray-200 bg-gray-100 rounded" disabled={currentPage <= 1} onClick={() => setSkip(Math.max(0, (currentPage - 2) * limit))}>
                Prev
              </Button>
            </div>
            <div className="text-sm font-medium">
              <nav aria-label="Pagination" className="flex items-center gap-1">
                {/** render page buttons with a compact window and ellipses **/}
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
                        onClick={() => setSkip((page - 1) * limit)}
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
              <Button aria-label="Next page" className="px-3 py-1 border border-gray-200 bg-gray-100 rounded" disabled={currentPage >= totalPages} onClick={() => setSkip(currentPage * limit)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}