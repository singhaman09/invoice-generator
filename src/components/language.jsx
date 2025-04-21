import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex justify-end mb-4">
      <select
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="border rounded px-2 py-1"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <option value="en">{t("english")}</option>
        <option value="hi">{t("hindi")}</option>
        <option value="ar">{t("arabic")}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;