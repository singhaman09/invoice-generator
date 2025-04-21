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
      dispatch(setSignature(sigPadRef.current.getCanvas().toDataURL("image/png")));
    }
  };

  return (
    <div className="mt-4">
      <label className="block font-medium mb-1">{t("drawSignature")}:</label>
      <SignatureCanvas
        ref={sigPadRef}
        canvasProps={{
          width: 400,
          height: 150,
          className: "border border-gray-300 rounded",
        }}
      />
      <div className="mt-2 flex gap-2">
        <button
          onClick={clearSignature}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          {t("clear")}
        </button>
        <button
          onClick={saveSignature}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          {t("save")}
        </button>
      </div>
      {invoice.signature && (
        <div className="mt-2">
          <p className="font-medium">{t("savedSignaturePreview")}:</p>
          <img
            src={invoice.signature}
            alt={t("signature")}
            className="h-12 border rounded mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;