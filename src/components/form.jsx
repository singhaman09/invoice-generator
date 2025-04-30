import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "./language";
import InvoiceHeader from "./ih";
import AddressFields from "./addfield";
import ItemList from "./itemlist";
import FileUpload from "./fileupload";
import SignaturePad from "./signpad";
import InvoiceSummary from "./summary";
import InvoicePreview from "./preview";
import { setInvoiceData, setEditMode } from "../redux/slices/invoice";

const InvoiceForm = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector((state) => state.invoice);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const previewRef = useRef();
  const isRtl = i18n.language === "ar";
  
  useEffect(() => {
    validateForm();
  }, [i18n.language]); 

  useEffect(() => {
    if (invoice.editMode) {
      setIsEditMode(true);
    } else {
      const checkForEditMode = () => {
        const editInvoice = localStorage.getItem("editInvoice");
        if (editInvoice) {
          try {
            const invData = JSON.parse(editInvoice);
            const formData = localStorage.getItem(`invoiceData_${invData.id}`);
            
            if (formData) {
              const parsedData = JSON.parse(formData);
              dispatch(setInvoiceData({
                ...parsedData,
              }));
              dispatch(setEditMode({
                editMode: true,
                editId: invData.id
              }));
              setIsEditMode(true);
              // Clear the temp storage
              localStorage.removeItem("editInvoice");
            }
          } catch (error) {
            console.error("Error loading edit data:", error);
          }
        }
      };
      
      checkForEditMode();
    }
  }, [dispatch, invoice.editMode]);

  function camelCaseToWords(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  }
  
  const validateForm = (field = null) => {
    const newErrors = { ...errors };

    const setFieldError = (fieldName, condition, message) => {
      if (condition) {
        newErrors[fieldName] = t(message);
      } else {
        delete newErrors[fieldName];
      }
    };

    if (!field || field === "invoiceNo") {
      setFieldError(
        "invoiceNo",
        !invoice.invoiceNo || !/^\d{3,10}$/.test(invoice.invoiceNo),
        t("InvalidInvoiceNo")
      );
    }
    if (!field || field === "invoiceDate") {
      setFieldError("invoiceDate", !invoice.invoiceDate, t("InvoiceDateRequired"));
    }
    if (!field || field === "dueDate") {
      if (!invoice.dueDate) {
        setFieldError("dueDate", true, t("DueDateRequired"));
      } else if (
        invoice.invoiceDate &&
        new Date(invoice.dueDate) < new Date(invoice.invoiceDate)
      ) {
        setFieldError("dueDate", true, t("DueDateAfterInvoiceDate"));
      } else {
        delete newErrors["dueDate"];
      }
    }

    ["billedBy", "billedTo"].forEach((section) => {
      Object.entries(invoice[section]).forEach(([key, value]) => {
        const fullKey = `${section}_${key}`;
        if (!field || field === fullKey) {
          setFieldError(fullKey, !value,  `${camelCaseToWords(t(key))} ${t("Required")}`);

          if (value) {
            if (key === "phone")
              setFieldError(fullKey, !/^\d{10}$/.test(value), t("InvalidPhoneNo"));
            if (key === "email")
              setFieldError(
                fullKey,
                !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
                t("InvalidEmail")
              );
            if (key === "gstin")
              setFieldError(
                fullKey,
                !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
                  value
                ),
                t("InvalidGSTIN")
              );
            if (key === "pan")
              setFieldError(
                fullKey,
                !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
                t("InvalidPAN")
              );
            if (key === "postalCode")
              setFieldError(
                fullKey,
                !/^\d{6}$/.test(value),
                t("InvalidPostalCode")
              );
          }
        }
      });
    });

    invoice.items.forEach((item, index) => {
      setFieldError(
        `item_${index}_name`,
        !item.name ? true : !/^[a-zA-Z\s]+$/.test(item.name),
        !item.name ? t("ItemNameRequired") : t("InvalidItemName")
      );
      
      setFieldError(
        `item_${index}_gstin`,
        !item.gstin ? true : !/^\d{1,2}$/.test(String(item.gstin).trim()),
        !item.gstin ? t("GSTRequired") : t("InvalidGST")
      );
      
      setFieldError(
        `item_${index}_qty`,
        isNaN(item.qty) || item.qty <= 0,
        t("InvalidQuantity")
      );
      setFieldError(
        `item_${index}_rate`,
        isNaN(item.rate) || item.rate <= 0,
        t("InvalidRate")
      );
    });
    
    setErrors(newErrors);

    if (!field) {
      return Object.keys(newErrors).length === 0;
    }
  };

  const handleCancelEdit = () => {
    // Reset form and navigate back to invoices list
    dispatch(setInvoiceData({
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
    }));
    navigate("/invoices");
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 bg-white shadow-md rounded-md"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <LanguageSelector />
      <h2 className="text-2xl font-bold mb-4">
        {isEditMode ? t("editInvoice") : t("invoiceForm")}
      </h2>

      {isEditMode && (
        <div className="mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-200">
          <p className="text-yellow-700">{t("editingInvoiceMessage")}</p>
          <button
            onClick={handleCancelEdit}
            className="mt-2 bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400 transition-colors cursor-pointer"
          >
            {t("cancelEdit")}
          </button>
        </div>
      )}

      <InvoiceHeader errors={errors} validateField={validateForm} />
      <AddressFields
        section="billedBy"
        errors={errors}
        validateField={validateForm}
      />
      <AddressFields
        section="billedTo"
        errors={errors}
        validateField={validateForm}
      />
      <ItemList errors={errors} validateField={validateForm} />
      <FileUpload type="logo" />
      <SignaturePad />

      <InvoiceSummary
        onPreview={() => validateForm() && setShowPreview(true)}
        isEditMode={isEditMode}
      />

      {showPreview && <InvoicePreview ref={previewRef} />}
    </div>
  );
};

export default InvoiceForm;