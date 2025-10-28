import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/features/auth/store/auth.slice';
import { fundingReducer } from '@/features/funding/store/funding.slice';
import cryptoFeeReducer from '@/features/fees/store/cryptoFeeSlice';
import giftCardRateReducer from '@/features/fees/store/giftCardRateSlice';
import ngnMarkupReducer from '@/features/fees/store/ngnMarkupSlice';
import usersReducer from '@/features/users/store/usersSlice';
import assetMarkdownReducer from '@/features/fees/store/assetMarkdownSlice';
import securityReducer from '@/features/security/store/securitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    funding: fundingReducer,
    cryptoFee: cryptoFeeReducer,
    giftCardRates: giftCardRateReducer,
  ngnMarkup: ngnMarkupReducer,
    assetMarkdown: assetMarkdownReducer,
  security: securityReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;