import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { fetchCryptoFees } from '../store/cryptoFeeSlice';
import type { AppDispatch, RootState } from '@/core/store/store';

export function FeesAndRates() {
  const dispatch = useDispatch<AppDispatch>();
  const { fees, loading, error } = useSelector((state: RootState) => state.cryptoFee);
  const titleCtx = useContext(DashboardTitleContext);


  useEffect(() => {
    titleCtx?.setTitle('Fees & Rates');
    titleCtx?.setBreadcrumb([
      'Fees & Rates',
      'Crypto Fees',
      'View all fees & rates',
    ]);
    
    dispatch(fetchCryptoFees());
  }, [dispatch]);


  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
      <div className="w-full">
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
          <DataTable columns={columns} data={fees || []} />
        )}
      </div>
    </div>
  );
}