import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(saved);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">
        Previous Invoices
      </h1>
      {invoices.length === 0 ? (
        <p className="text-gray-600">No invoices generated yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 border rounded shadow bg-white">
              <h2 className="text-xl font-semibold mb-2">{inv.name}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Generated at: {inv.createdAt}
              </p>
              <a
                href={inv.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View PDF
              </a>
              <div className="mt-4 flex flex-col items-center">
                <QRCodeCanvas value={inv.qrLink} size={100} />

                <p className="text-xs mt-2 text-center text-gray-500">
                  Scan to view this invoice
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
