import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { uploadPDFToCloudinary } from "../utils/uploadToCloundinary";

const InvoiceSummary = ({ onPreview }) => {
  const { t } = useTranslation();
  const invoice = useSelector((state) => state.invoice);

  const totalAmount = invoice.items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gst) || 0;
    return sum + qty * rate + gst / 100;
  }, 0);

  const handleExportPDF = async () => {
    const input = document.getElementById("invoice-preview");
    if (!input) return alert("Invoice preview not found.");

    try {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");
      if (pdfBlob.size === 0) {
        alert("Empty PDF generated. Skipping upload.");
        return;
      }
      const cloudinaryUrl = await uploadPDFToCloudinary(pdfBlob);
      if (!cloudinaryUrl) throw new Error("Cloudinary upload failed");

      const invoiceData = {
        id: Date.now(),
        name: `Invoice_${invoice.invoiceNo}`,
        url: cloudinaryUrl,
        qrLink: cloudinaryUrl,
        createdAt: new Date().toLocaleString(),
      };

      const existing = JSON.parse(localStorage.getItem("invoices")) || [];
      localStorage.setItem(
        "invoices",
        JSON.stringify([...existing, invoiceData])
      );

      pdf.save(`Invoice_${invoice.invoiceNo}.pdf`);
      alert("Invoice exported, uploaded, and saved!");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mt-6">
        {t("totalAmount")}: ₹{totalAmount.toFixed(2)}
      </h3>
      <div className="mt-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={onPreview}
        >
          {t("previewInvoice")}
        </button>
        <button
          className="ml-2 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          onClick={handleExportPDF}
        >
          {t("exportAsPDF")}
        </button>
      </div>
    </div>
  );
};

export default InvoiceSummary;
