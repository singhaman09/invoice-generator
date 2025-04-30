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
  items: [{ name: '', gstin: '', qty: '', rate: '' }],
  logo: null,
  signature: null,
  pdfUrl: null,
  editMode: false,
  editId: null,
};


const loadFromLocalStorage = () => {
  const editInvoice = localStorage.getItem("editInvoice");
  
  if (editInvoice) {
    const invoice = JSON.parse(editInvoice);
    const formData = localStorage.getItem(`invoiceData_${invoice.id}`);
    
    if (formData) {
      localStorage.removeItem("editInvoice"); //delete the flag from localStorage, otherwise keeps edit mode ON.
      const invoiceData = JSON.parse(formData);
      return {
        ...invoiceData,
        editMode: true,
        editId: invoice.id
      };
    }
  }
  
  const storedData = localStorage.getItem('invoiceData');
  return storedData ? JSON.parse(storedData) : initialState;
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: loadFromLocalStorage(),
  reducers: {
    setInvoiceData: (state, action) => {
      const newState = { ...state, ...action.payload };
      localStorage.setItem('invoiceData', JSON.stringify(newState));
      return newState;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload.editMode;
      state.editId = action.payload.editId;
      localStorage.setItem('invoiceData', JSON.stringify(state));
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload);
      localStorage.setItem('invoiceData', JSON.stringify(state)); 
    },
    removeItem: (state, action) => {
      state.items.splice(action.payload, 1);
      localStorage.setItem('invoiceData', JSON.stringify(state)); 
    },
    updateItem: (state, action) => {
      const { index, field, value } = action.payload;
      state.items[index][field] = value;
      localStorage.setItem('invoiceData', JSON.stringify(state)); 
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
      localStorage.setItem('invoiceData', JSON.stringify(state)); 
    },
    setSignature: (state, action) => {
      state.signature = action.payload;
      localStorage.setItem('invoiceData', JSON.stringify(state)); 
    },
    setPdfUrl: (state, action) => {
      state.pdfUrl = action.payload;
      localStorage.setItem('invoiceData', JSON.stringify(state));
    },
    resetInvoice: () => {
      const resetState = { ...initialState };
      localStorage.setItem('invoiceData', JSON.stringify(resetState));
      return resetState;
    },
  },
});

export const {
  setInvoiceData,
  setEditMode,
  addItem,
  removeItem,
  updateItem,
  setLogo,
  setSignature,
  setPdfUrl,
  resetInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;