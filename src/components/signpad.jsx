import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignature } from "../redux/slices/invoice";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";

const SignaturePad = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const invoice = useSelector((state) => state.invoice);
  const sigPadRef = useRef();

  const clearSignature = () => {
    sigPadRef.current.clear();
    dispatch(setSignature(null));
  };

  const saveSignature = () => {
    if (!sigPadRef.current.isEmpty()) {
      dispatch(
        setSignature(sigPadRef.current.getCanvas().toDataURL("image/png"))
      );
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <label className="block font-medium text-gray-800 dark:text-white mb-2">
        {t("drawSignature")}:
      </label>

      {/* Signature Canvas */}
      <SignatureCanvas
        ref={sigPadRef}
        canvasProps={{
          width: 400,
          height: 150,
          className:
            "border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm",
        }}
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={clearSignature}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
        >
          {t("clear")}
        </button>
        <button
          onClick={saveSignature}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
        >
          {t("save")}
        </button>
      </div>

      {invoice.signature && (
        <div className="mt-4">
          <p className="font-medium text-gray-800 dark:text-white">
            {t("savedSignaturePreview")}:
          </p>
          <img
            src={invoice.signature}
            alt={t("signature")}
            className="h-16 w-auto border rounded-lg mt-2 shadow-md object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
