import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import type { CryptoFee } from '@/features/fees/type/fee';
import { SearchFee } from './SearchFee';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/core/store/store';
import { fetchCryptoFee } from '../store/cryptoFeeSlice';

export function ViewFee() {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const state = location.state as { fee?: CryptoFee } | null;
  const feeFromNav = state?.fee;
  const params = useParams();
  const paramCurrency = params.currency;
  const paramNetwork = params.network ? decodeURIComponent(params.network) : undefined;

  // canonical fee from the store
  const canonical = useSelector((s: RootState) => s.cryptoFee.selectedFee) as CryptoFee | null;

  // determine currency/network to fetch from navigation state
  // prefer route params if present
  const currency = paramCurrency ?? feeFromNav?.currency;
  const network = paramNetwork ?? feeFromNav?.network;

  useEffect(() => {
    if (currency && network) {
      // fetch canonical data from server and store in slice
      dispatch(fetchCryptoFee({ currency, network }));
    }
  }, [currency, network, dispatch]);

  // prefer canonical when available, otherwise show navigation-provided fee
  const displayFee = useMemo(() => canonical ?? feeFromNav ?? null, [canonical, feeFromNav]);

  return <SearchFee initialFee={displayFee ?? undefined} />;
}

export default ViewFee;
