import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInvoiceData } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const InvoiceHeader = ({ errors, validateField }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const handleChange = useCallback(
    (field, value) => dispatch(setInvoiceData({ [field]: value })),
    [dispatch]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
      {["invoiceNo", "invoiceDate", "dueDate"].map((field) => (
        <div key={field} className="flex flex-col">
          <label
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2 capitalize"
            htmlFor={field}
          >
            {t(field)}
          </label>
          <input
            id={field}
            type={field.includes("Date") ? "date" : "text"}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 cursor-pointer"
            value={invoice[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => validateField(field)} 
            dir={isRtl ? "rtl" : "ltr"}
            min={field === "dueDate" ? invoice.invoiceDate : undefined}
            placeholder={t("Enter")}
          />
          {errors[field] && (
            <p className="mt-2 text-red-500 text-sm">{errors[field]}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default InvoiceHeader;
