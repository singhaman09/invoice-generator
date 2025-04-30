import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInvoiceData } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const AddressFields = ({ section, errors, validateField }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const handleInputChange = (key, value) => {
    dispatch(setInvoiceData({
      [section]: { ...invoice[section], [key]: value }
    }));
    validateField(`${section}_${key}`);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{t(section)}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.keys(invoice[section]).map((key) => (
          <div key={key} className="flex flex-col">
            <label
              className="block font-medium text-gray-700 dark:text-gray-300 capitalize mb-2"
              htmlFor={`${section}_${key}`}
            >
              {t(key)}
            </label>
            <input
              id={`${section}_${key}`}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
              value={invoice[section][key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
              onBlur={() => validateField(`${section}_${key}`)}
              dir={isRtl ? "rtl" : "ltr"}
              placeholder={t(`${t(key)}`)}
            />
            {errors[`${section}_${key}`] && (
              <p className="mt-2 text-red-500 text-sm">{errors[`${section}_${key}`]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressFields;
