import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const InvoicePreview = forwardRef((props, ref) => {
  const { t, i18n } = useTranslation();
  const invoice = useSelector((state) => state.invoice);
  const isRtl = i18n.language === "ar";

  const totalAmount = invoice.items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gst) || 0;
    return sum + qty * rate + gst / 100;
  }, 0);

  const handleExportPDF = async () => {
    const input = document.getElementById("invoice-preview");
    if (!input) return toast.error("Invoice preview not found.");

    const loadingToastId = toast.loading("Generating PDF...");
  
    try {
      const downloadButton = document.getElementById("download-button");
      if (downloadButton) {
        downloadButton.style.display = "none";
      }
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice.invoiceNo || "preview"}.pdf`);
  
      toast.update(loadingToastId, {
        render: "PDF downloaded successfully!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      if (downloadButton) {
        downloadButton.style.display = "inline-block";
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.update(loadingToastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };
  

  return (
    <div
  style={{
    backgroundColor: "#f0f0f0", 
    minHeight: "100vh",          
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    padding: "2rem",
    boxSizing: "border-box",
    marginTop:"2rem"
  }}
>
    <div
      id="invoice-preview"
      ref={ref}
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff", 
        padding: "2rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",  
        border: "1px solid #ddd",
        boxSizing: "border-box",
        direction: isRtl ? "rtl" : "ltr",
        textAlign: isRtl ? "right" : "left",
        color: "#333",
        // height: "100vh",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#2D3748",
          borderBottom: "3px solid #E2E8F0",
          backgroundColor: "#F7FAFC", 
          borderRadius: "8px",  
          padding:"3px"

        }}
      >
        {t("invoicePreview")} - {invoice.invoiceNo}
      </h2>

      {invoice.logo && (
        <img
          src={invoice.logo}
          alt={t("logo")}
          style={{
            height: "5rem",
            width: "8rem",
            marginTop: "2rem",
            border: "2px solid #E2E8F0",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        />
      )}
      <br />
      <p style={{marginTop:"2rem"}}>
        <strong>{t("invoiceNo")}:</strong> {invoice.invoiceNo}
      </p>
      <p>
        <strong>{t("invoiceDate")}:</strong> {invoice.invoiceDate}
      </p>
      <p>
        <strong>{t("dueDate")}:</strong> {invoice.dueDate}
      </p>

      {/* Billed By and Billed To section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "9rem",
          marginTop: "2rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <h4 style={{ color: "#2C5282", fontWeight: "600" }}>
            <strong>{t("billedBy")}</strong>
          </h4>
          <p>
            <strong>{t("name")}</strong> -{" "}
            <span>{invoice.billedBy?.businessName}</span>
          </p>
          <p>
            <strong>{t("email")}</strong> -
            <span>{invoice.billedBy?.email}</span>
          </p>
          <p>
            <strong>{t("phone")}</strong> -
            <span>{invoice.billedBy?.phone}</span>
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: "#2C5282", fontWeight: "600" }}>
            <strong>{t("billedTo")}</strong>
          </h4>
          <p>
            <strong>{t("name")}</strong> -{" "}
            <span>{invoice.billedTo?.businessName}</span>
          </p>
          <p>
            <strong>{t("email")}</strong> -
            <span>{invoice.billedTo?.email}</span>
          </p>
          <p>
            <strong>{t("phone")}</strong> -
            <span>{invoice.billedTo?.phone}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <h4
        style={{
          fontWeight: "600",
          marginTop: "3rem",
          marginBottom: "0.5rem",
          color: "#2D3748",
        }}
      >
        {t("items")}
      </h4>
      <table
        style={{
          width: "100%",
          fontSize: "0.875rem",
          border: "1px solid #E2E8F0",
          borderCollapse: "collapse",
        }}
      >
        <thead style={{ backgroundColor: "#EDF2F7" }}>
          <tr>
            {["name", "gstin", "quantity", "rate", "amount"].map((header) => (
              <th
                key={header}
                style={{
                  border: "1px solid #E2E8F0",
                  padding: "0.5rem",
                  backgroundColor: "#E2E8F0",
                  textAlign: "center",
                  color: "#4A5568",
                }}
              >
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
              <tr
                key={index}
                style={{
                  textAlign: "center",
                  backgroundColor: index % 2 === 0 ? "#F7FAFC" : "#FFFFFF",
                }}
              >
                <td
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "0.5rem",
                    color: "#4A5568",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "0.5rem",
                    color: "#4A5568",
                  }}
                >
                  {item.gstin}%
                </td>
                <td
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "0.5rem",
                    color: "#4A5568",
                  }}
                >
                  {qty}
                </td>
                <td
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "0.5rem",
                    color: "#4A5568",
                  }}
                >
                  ₹{rate.toFixed(2)}
                </td>
                <td
                  style={{
                    border: "1px solid #E2E8F0",
                    padding: "0.5rem",
                    color: "#4A5568",
                  }}
                >
                  ₹{total.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <p style={{marginTop: "3rem"}}>
        <strong>{t("total")}:</strong> ₹{totalAmount.toFixed(2)}
      </p>

      {/* Signature */}
      {invoice.signature && (
        <div>
          <p style={{ fontWeight: "600", color: "#2C5282" ,marginTop:"3rem"}}>
            {t("authorizedSignature")}
          </p>
          <img
            src={invoice.signature}
            alt={t("signature")}
            style={{
              maxWidth: "10rem",
              height: "auto",
              borderTop: "2px solid #E2E8F0",
              marginTop: "1rem",
            }}
          />
        </div>
      )}

      {/* Capture Button */}
      <button
        id="download-button"
        onClick={handleExportPDF}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4C51BF",
          color: "#fff",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>
    </div>
    </div>
  );
});

export default InvoicePreview;
