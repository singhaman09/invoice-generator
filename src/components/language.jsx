import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex justify-end mb-4">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-300"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <option value="en" className="cursor-pointer">
          {("English")}
        </option>
        <option value="hi" className="cursor-pointer">
          {("हिन्दी")}
        </option>
        <option value="ar" className="cursor-pointer">
          {("العربية")}
        </option>
      </select>
    </div>
  );
};

export default LanguageSelector;
