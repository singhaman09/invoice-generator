import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  invoiceNo: '',
  invoiceDate: '',
  dueDate: '',
  billedBy: {
    businessName: '',
    phone: '',
    gstin: '',
    email: '',
    pan: '',
    city: '',
    postalCode: '',
    state: '',
    

  },
  billedTo: {
    businessName: '',
    phone: '',
    gstin: '',
    email: '',
    pan: '',
    city: '',
    postalCode: '',
    state: '',
  },
  items: [{ name: '', gst: '', qty: '', rate: '' }],
  logo: null,
  signature: null,
  pdfUrl: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoiceData: (state, action) => {
      return { ...state, ...action.payload };
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeItem: (state, action) => {
      state.items.splice(action.payload, 1);
    },
    updateItem: (state, action) => {
      const { index, field, value } = action.payload;
      state.items[index][field] = value;
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
    setSignature: (state, action) => {
      state.signature = action.payload;
    },
  },
});

export const {
  setInvoiceData,
  addItem,
  removeItem,
  updateItem,
  setLogo,
  setSignature,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
