import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogo, setSignature } from "../redux/slices/invoice";
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
      dispatch(type === "logo" ? setLogo(reader.result) : setSignature(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4">
      <label className="block font-medium">{t(`upload${type.charAt(0).toUpperCase() + type.slice(1)}`)}:</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mb-2"
      />
      {invoice[type] && (
        <img src={invoice[type]} alt={t(type)} className="h-12 mb-2" />
      )}
    </div>
  );
};

export default FileUpload;