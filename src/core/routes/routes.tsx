import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from '@/core/guards/AuthGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { UserList } from '@/features/users/pages/UserList';
import { FeesAndRates } from '@/features/fees/pages/FeesAndRates';
import { EditFee } from '@/features/fees/pages/EditFee';
import { EditNetworkName } from '@/features/fees/pages/EditNetworkName';
import { SearchFee } from '@/features/fees/pages/SearchFee';
import { ViewFee } from '@/features/fees/pages/ViewFee';
import { FundingAndBalances } from '@/features/funding/pages/FundingAndBalances';
import { Security } from '@/features/security/pages/Security';
import { AuditAndMonitoring } from '@/features/audit/pages/AuditAndMonitoring';
import { Settings } from '@/features/settings/pages/Settings';
import { Disable2Fa } from '@/features/users/pages/Disable2Fa';
import { RemovePassword } from '@/features/users/pages/RemovePassword';
import { UserWallet } from '@/features/funding/pages/UserWallet';
import { GiftCardRates } from '@/features/fees/pages/GiftCardRates';
import { NgnMarkup } from '@/features/fees/pages/NgnMarkup';
import { PriceCalculator } from '@/features/fees/pages/PriceCalculator';
import { CreateNewAdmin } from '@/features/users/pages/CreateNewAdmin';
import { WipePendingBalance } from '@/features/funding/pages/WipePendingBalance';
import { WalletGenerateByPhone } from '@/features/users/pages/WalletGenerateByPhone';
import { RegenerateWalletByPhone } from '@/features/users/pages/RegenerateWalletByPhone';
import { Summary } from '@/features/users/pages/Summary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: <Dashboard />,
          },
          {
            path: 'users',
            element: <UserList />,
          },
          {
            path: 'user-management/summary',
            element: <Summary />,
          },
          {
            path: 'user-management/disable-2fa',
            element: <Disable2Fa />,
          },
          {
            path: 'user-management/create-new-admin',
            element: <CreateNewAdmin />,
          },
          {
            path: 'user-management/remove-password',
            element: <RemovePassword />,
          },
          {
            path: 'user-management/fetch-wallets',
            element: <UserWallet />,
          },
          {
            path: 'user-management/wipe-pending-balance',
            element: <WipePendingBalance />,
          },
          {
            path: 'user-management/wallet-generation',
            element: <RemovePassword />,
          },
          {
            path: 'user-management/generate-wallet-by-phone',
            element: <WalletGenerateByPhone />,
          },
          {
            path: 'user-management/regenerate-wallet-by-phone',
            element: <RegenerateWalletByPhone />,
          },
          {
            path: 'fees-rates',
            element: <FeesAndRates />,
          },
          { 
            path: 'fees-rates/gift-card-rates',
            element: <GiftCardRates />,
          },
          { 
            path: 'fees-rates/ngn-markup',
            element: <NgnMarkup />,
          },
          { 
            path: 'fees-rates/price-calculator',
            element: <PriceCalculator />,
          },
          {
            path: 'fees-rates/edit-fee',
            element: <EditFee />,
          },
          {
            path: 'fees-rates/edit-network-name',
            element: <EditNetworkName />,
          },
          {
            path: 'fees-rates/view-specific-fee',
            element: <ViewFee />,
          },
          {
            path: 'fees-rates/view/:currency/:network',
            element: <ViewFee />,
          },
          {
            path: 'fees-rates/search',
            element: <SearchFee />,
          },
          {
            path: 'funding',
            element: <FundingAndBalances />,
          },
          {
            path: 'security',
            element: <Security />,
          },
          {
            path: 'audit',
            element: <AuditAndMonitoring />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
        ],
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'reset-password',
    element: <ResetPasswordPage />,
  },
]);