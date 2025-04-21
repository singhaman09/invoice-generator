import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./language";
import InvoiceHeader from "./ih";
import AddressFields from "./addfield";
import ItemList from "./itemlist";
import FileUpload from "./fileupload";
import SignaturePad from "./signpad";
import InvoiceSummary from "./summary";
import InvoicePreview from "./preview";

const InvoiceForm = () => {
  const { t, i18n } = useTranslation();
  const invoice = useSelector((state) => state.invoice);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const previewRef = useRef();
  const isRtl = i18n.language === "ar";

  const validateForm = () => {
    const newErrors = {};
    if (!invoice.invoiceNo || !/^\d{3,10}$/.test(invoice.invoiceNo))
      newErrors.invoiceNo = t("invoiceNoRequired");
    if (!invoice.invoiceDate) newErrors.invoiceDate = t("invoiceDateRequired");
    if (!invoice.dueDate) newErrors.dueDate = t("dueDateRequired");

    ["billedBy", "billedTo"].forEach((section) =>
      Object.entries(invoice[section]).forEach(([key, value]) => {
        if (!value) newErrors[`${section}_${key}`] = t(`${key}Required`);
      })
    );

    invoice.items.forEach((item, index) => {
      if (!item.name) newErrors[`item_${index}_name`] = t("itemNameRequired");
      if (isNaN(item.qty) || item.qty === "")
        newErrors[`item_${index}_qty`] = t("invalidQuantity");
      if (isNaN(item.rate) || item.rate === "")
        newErrors[`item_${index}_rate`] = t("invalidRate");
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 bg-white shadow-md rounded-md"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <LanguageSelector />
      <h2 className="text-2xl font-bold mb-4">{t("invoiceForm")}</h2>
      <InvoiceHeader errors={errors} />
      <AddressFields section="billedBy" errors={errors} />
      <AddressFields section="billedTo" errors={errors} />
      <ItemList errors={errors} />
      <FileUpload type="logo" />
      <SignaturePad />
      <InvoiceSummary
        onPreview={() => validateForm() && setShowPreview(true)}
      />
      {showPreview && <InvoicePreview ref={previewRef} />}
    </div>
  );
};

export default InvoiceForm;