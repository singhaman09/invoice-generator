import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { uploadPDFToCloudinary } from "../utils/uploadToCloundinary";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { resetInvoice } from "../redux/slices/invoice";

const InvoiceSummary = ({ onPreview, isEditMode }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector((state) => state.invoice);

  const totalAmount = invoice.items.reduce((sum, item) => {
    const qty = parseFloat(item.qty) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gstin) || 0;
    return sum + qty * rate + (qty * rate * gst) / 100;
  }, 0);

  const handleExportPDF = async () => {
    const input = document.getElementById("invoice-preview");
    if (!input) return toast.error("Invoice preview not found.");

    const loadingToastId = toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(input, {
        scale: 4,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const pdfBlob = pdf.output("blob");
      if (pdfBlob.size === 0) {
        toast.update(loadingToastId, {
          render: "Empty PDF generated. Skipping upload.",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }

      const cloudinaryUrl = await uploadPDFToCloudinary(pdfBlob);
      if (!cloudinaryUrl) throw new Error("Cloudinary upload failed");

      if (isEditMode && invoice.editId) {
        await handleUpdateInvoice(cloudinaryUrl);
      } else {
        await handleCreateInvoice(cloudinaryUrl);
      }

      pdf.save(`Invoice_${invoice.invoiceNo}.pdf`);

      toast.update(loadingToastId, {
        render: isEditMode
          ? "Invoice Updated Successfully!"
          : "PDF Generated Successfully!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });

      dispatch(resetInvoice());
      navigate("/invoices");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.update(loadingToastId, {
        render: "Something went wrong!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    }
  };

  const handleCreateInvoice = async (cloudinaryUrl) => {
    const invoiceId = Date.now();

    const invoiceData = {
      id: invoiceId,
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

    localStorage.setItem(`invoiceData_${invoiceId}`, JSON.stringify(invoice));

    await addDoc(collection(db, "invoices"), {
      invoiceNo: invoice.invoiceNo,
      url: cloudinaryUrl,
      total: totalAmount,
      createdAt: new Date().toISOString(),
    });
  };

  const handleUpdateInvoice = async (cloudinaryUrl) => {
    const existing = JSON.parse(localStorage.getItem("invoices")) || [];

    const updatedInvoices = existing.map((inv) => {
      if (inv.id === invoice.editId) {
        return {
          ...inv,
          name: `Invoice_${invoice.invoiceNo}`,
          url: cloudinaryUrl,
          qrLink: cloudinaryUrl,
          updatedAt: new Date().toLocaleString(),
        };
      }
      return inv;
    });

    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));

    localStorage.setItem(
      `invoiceData_${invoice.editId}`,
      JSON.stringify({
        ...invoice,
        pdfUrl: cloudinaryUrl,
      })
    );

    try {
      if (invoice.firebaseDocId) {
        const invoiceRef = doc(db, "invoices", invoice.firebaseDocId);
        await updateDoc(invoiceRef, {
          invoiceNo: invoice.invoiceNo,
          url: cloudinaryUrl,
          total: totalAmount,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Firebase update failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">
        {t("totalAmount")}: ₹{totalAmount.toFixed(2)}
      </h3>
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 cursor-pointer"
          onClick={onPreview}
        >
          {t("previewInvoice")}
        </button>
        <button
          className={`${
            isEditMode
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          } text-white px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 cursor-pointer`}
          onClick={handleExportPDF}
        >
          {isEditMode ? t("updateInvoice") : t("exportAsPDF")}
        </button>
      </div>
    </div>
  );
};

export default InvoiceSummary;
