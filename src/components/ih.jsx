import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInvoiceData } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const InvoiceHeader = ({ errors }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const handleChange = useCallback(
    (field, value) => dispatch(setInvoiceData({ [field]: value })),
    [dispatch]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {["invoiceNo", "invoiceDate", "dueDate"].map((field) => (
        <div key={field}>
          <label className="block font-medium">{t(field)}</label>
          <input
            type={field.includes("Date") ? "date" : "text"}
            className="w-full border rounded px-2 py-1"
            value={invoice[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            dir={isRtl ? "rtl" : "ltr"}
          />
          {errors[field] && (
            <p className="text-red-500 text-sm">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvoiceHeader;