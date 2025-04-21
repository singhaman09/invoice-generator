import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInvoiceData } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const AddressFields = ({ section, errors }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const handleChange = useCallback(
    (field, value) =>
      dispatch(setInvoiceData({ [section]: { ...invoice[section], [field]: value } })),
    [dispatch, invoice, section]
  );

  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{t(section)}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(invoice[section]).map(([key, value]) => (
          <div key={key}>
            <label className="block font-medium capitalize">{t(key)}</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              dir={isRtl ? "rtl" : "ltr"}
            />
            {errors[`${section}_${key}`] && (
              <p className="text-red-500 text-sm">{errors[`${section}_${key}`]}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default AddressFields;