import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogo} from "../redux/slices/invoice";
import { useTranslation } from "react-i18next";

const FileUpload = ({ type }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(setLogo(reader.result))
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-6 flex items-center space-x-4">
      {/* Image Preview */}
      {invoice[type] && (
        <div className="flex-shrink-0">
          <img
            src={invoice[type]}
            alt={t(type)}
            className="h-16 w-16 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}
      
      {/* File Input */}
      <div className="flex-1">
        <label className="block font-medium text-gray-800 dark:text-white cursor-pointer mb-2">
          {t(`upload${type.charAt(0).toUpperCase() + type.slice(1)}`)}:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 mb-2 cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default FileUpload;
