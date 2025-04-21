import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, updateItem } from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const ItemList = ({ errors }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  return (
    <>
      <h3 className="text-lg font-semibold mt-6 mb-2">{t("items")}</h3>
      {invoice.items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-3 items-center"
        >
          {["name", "gst", "qty", "rate"].map((field) => (
            <input
              key={field}
              className="border rounded px-2 py-1"
              placeholder={t(field)}
              value={item[field]}
              onChange={(e) =>
                dispatch(updateItem({ index, field, value: e.target.value }))
              }
              dir={isRtl ? "rtl" : "ltr"}
            />
          ))}
          <button
            className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600"
            onClick={() => dispatch(removeItem(index))}
          >
            {t("remove")}
          </button>
          <div className="col-span-full text-sm text-red-500">
            {errors[`item_${index}_name`] ||
              errors[`item_${index}_qty`] ||
              errors[`item_${index}_rate`]}
          </div>
        </div>
      ))}
      <button
        className="mt-2 mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => dispatch(addItem({ name: "", gst: "", qty: "", rate: "" }))}
      >
        {t("addItem")}
      </button>
    </>
  );
};

export default ItemList;