import { useContext, useEffect } from 'react';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { FundUserForm } from '../components/form';

export function FundingAndBalances() {
    const titleCtx = useContext(DashboardTitleContext);

  useEffect(() => {
    titleCtx?.setTitle('Funding User');
    titleCtx?.setBreadcrumb([
      'Funding & Balances',
      'Fund User',
    ]);
    // Only run once on mount
  }, []);

  return (
    <div className="w-full bg-white space-y-6 p-4 rounded">
      <div className="w-full flex justify-center items-center">
        <FundUserForm />    
      </div>
    </div>
  );
}