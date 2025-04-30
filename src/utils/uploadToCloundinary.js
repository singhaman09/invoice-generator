export const uploadPDFToCloudinary = async (pdfBlob) => {
    const formData = new FormData();
    formData.append("file", pdfBlob);
    formData.append("upload_preset", "invoice_unsigned");
    formData.append("folder", "invoices");
    formData.append("public_id", `invoice_${Date.now()}`);

    const cloudName = import.meta.env.VITE_CLOUD_NAME;
  
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error(data);
      throw new Error(data.error?.message || "Upload failed");
    }
  
    return data.secure_url; 
}