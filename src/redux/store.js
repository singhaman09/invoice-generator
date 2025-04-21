import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './slices/invoice';

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
  },
});
