import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas as QRCode } from "qrcode.react";

const InvoicePreview = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const generateQRData = () => {
    const invoiceData = {
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      billedBy: invoice.billedBy,
      billedTo: invoice.billedTo,
      items: invoice.items.map((item) => ({
        name: item.name,
        gst: parseFloat(item.gst) || 0,
        qty: parseFloat(item.qty) || 0,
        rate: parseFloat(item.rate) || 0,
        total: (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) + (parseFloat(item.gst) || 0) / 100,
      })),
      totalAmount: invoice.items.reduce((sum, item) => {
        const qty = parseFloat(item.qty) || 0;
        const rate = parseFloat(item.rate) || 0;
        const gst = parseFloat(item.gst) || 0;
        return sum + qty * rate + gst / 100;
      }, 0),
    };
    return `http://localhost:5173/`;
  };

  const totalAmount = invoice.items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gst) || 0;
    return sum + qty * rate + gst / 100;
  }, 0);

  return (
    <div
      id="invoice-preview"
      ref={ref}
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        border: "1px solid #d1d5db",
        borderRadius: "0.25rem",
        backgroundColor: "#f9fafb",
        direction: isRtl ? "rtl" : "ltr",
        textAlign: isRtl ? "right" : "left",
      }}
    >
      <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem", textAlign: "center" }}>
        {t("invoicePreview")}
      </h2>
      {invoice.logo && (
        <img
          src={invoice.logo}
          alt={t("logo")}
          style={{ height: "5rem", width: "8rem", marginTop: "0.5rem" }}
        />
      )}
      <p><strong>{t("invoiceNo")}:</strong> {invoice.invoiceNo}</p>
      <p><strong>{t("invoiceDate")}:</strong> {invoice.invoiceDate}</p>
      <p><strong>{t("dueDate")}:</strong> {invoice.dueDate}</p>
      <h4 style={{ fontWeight: "600", marginTop: "1rem", marginBottom: "0.5rem" }}>{t("items")}</h4>
      <table style={{ width: "100%", fontSize: "0.875rem", border: "1px solid #d1d5db", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f3f4f6" }}>
          <tr>
            {["name", "gst", "quantity", "rate", "amount"].map((header) => (
              <th key={header} style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>
                {t(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => {
            const qty = parseFloat(item.qty) || 0;
            const rate = parseFloat(item.rate) || 0;
            const gst = parseFloat(item.gst) || 0;
            const total = qty * rate + gst / 100;
            return (
              <tr key={index} style={{ textAlign: "center" }}>
                <td style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>{item.name}</td>
                <td style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>{item.gst}%</td>
                <td style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>{qty}</td>
                <td style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>₹{rate.toFixed(2)}</td>
                <td style={{ border: "1px solid #d1d5db", padding: "0.25rem 0.5rem" }}>₹{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p><strong>{t("total")}:</strong> ₹{totalAmount.toFixed(2)}</p>
      <div style={{ marginTop: "1rem" }}>
        <p><strong>{t("scanQR")}:</strong></p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: isRtl ? "flex-end" : "center" }}>
          <QRCode value={generateQRData()} size={128} style={{ marginTop: "0.5rem" }} level="H" includeMargin={true} />
          <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", maxWidth: "200px", textAlign: isRtl ? "right" : "center" }}>
            {t("scanToView")}
          </p>
        </div>
      </div>
      {invoice.signature && (
        <div>
          <p>{t("authorizedSignature")}:</p>
          <img src={invoice.signature} alt={t("signature")} />
        </div>
      )}
    </div>
  );
});

export default InvoicePreview;