import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItem } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const ItemList = ({ errors, validateField }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const handleInputChange = (index, field, value) => {
    dispatch(updateItem({ index, field, value }));
    validateField(`item_${index}_${field}`);
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">
        {t("items")}
      </h3>

      {invoice.items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4 items-center border-b pb-4"
        >
          {["name", "gstin", "qty", "rate"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="block font-medium text-gray-800 dark:text-white capitalize">
                {t(field)}
              </label>
              <input
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(field)}
                value={item[field]}
                onChange={(e) => handleInputChange(index, field, e.target.value)}
                onBlur={() => validateField(`item_${index}_${field}`)}
                dir={isRtl ? "rtl" : "ltr"}
              />
              {errors[`item_${index}_${field}`] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[`item_${index}_${field}`]}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-center items-center">
            <button
              className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer"
              onClick={() => dispatch(removeItem(index))}
              disabled={invoice.items.length === 1}
            >
              {t("remove")}
            </button>
          </div>
        </div>
      ))}

      <div className="text-center">
        <button
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          onClick={() => dispatch(addItem({ name: "", gstin: "", qty: "", rate: "" }))}
        >
          {t("addItem")}
        </button>
      </div>
    </>
  );
};

export default ItemList;
