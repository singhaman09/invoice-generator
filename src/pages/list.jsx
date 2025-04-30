import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";  //useHistory-previosuly
import { useDispatch } from "react-redux";
import { setInvoiceData, setEditMode } from "../redux/slices/invoice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(saved);
  }, []);

  const handleEdit = (invoice) => {
    const storedInvoiceData = JSON.parse(
      localStorage.getItem(`invoiceData_${invoice.id}`)
    );

    if (storedInvoiceData) {
      dispatch(
        setInvoiceData({
          ...storedInvoiceData,
          editMode: true,
          editId: invoice.id,
        })
      );

      dispatch(
        setEditMode({
          editMode: true,
          editId: invoice.id,
        })
      );
      navigate("/");
      toast.info(
        "Editing invoice. Make your changes and click 'Update Invoice' when done."
      );
    } else {
      toast.error("Invoice data not found for editing.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const updatedInvoices = invoices.filter((inv) => inv.id !== id);

      localStorage.setItem("invoices", JSON.stringify(updatedInvoices));

      localStorage.removeItem(`invoiceData_${id}`);

      setInvoices(updatedInvoices);

      toast.success("Invoice deleted successfully", {
        toastId: "success1",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">
        {t("PreviousInvoices")}
      </h1>

      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            {t("Noinvoicesgeneratedyet")}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none"
          >
            {t("CreateNewInvoice")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {inv.name}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {inv.updatedAt
                  ? `Last updated: ${inv.updatedAt}`
                  : `Generated at: ${inv.createdAt}`}
              </p>
              <a
                href={inv.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline mb-4 inline-block"
              >
                {t("ViewPDF")}
              </a>

              <div className="mt-4 flex flex-col items-center">
                <QRCodeCanvas value={inv.qrLink} size={120} />
                <p className="text-xs mt-2 text-center text-gray-500">
                  {t("Scantoviewthisinvoice")}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 focus:outline-none flex-1 cursor-pointer"
                  onClick={() => handleEdit(inv)}
                >
                  {t("EditInvoice")}
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none flex-1 cursor-pointer"
                  onClick={() => handleDelete(inv.id)}
                >
                  {t("Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
