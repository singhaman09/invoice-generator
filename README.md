# 🧾 Invoice Generator

A simple and elegant web application to create, preview, export, and store invoices, with built-in PDF generation and QR code support. You can even save your invoices online with Cloudinary and access them later using QR codes.

## 🚀 Features
🔧 Dynamic Invoice Form — Enter client details, items, GST, etc.

🔧 Firebase — For signup with google.

👀 Live Invoice Preview — See how your invoice looks in real-time.

📄 Export to PDF — Download professional invoices as PDF.

☁️ Cloud Storage — Upload PDF to Cloudinary and get a public link.

☁️ Firebase Store — Used store to keep invoice details.

📦 QR Code Generator — Scan and open the invoice instantly.

🧠 LocalStorage Support — Store and list previous invoices.

## 📷 Demo
![Screenshot from 2025-04-24 13-36-34](https://github.com/user-attachments/assets/c944d642-74f4-4431-ac19-5170a4f23715)


![Screenshot from 2025-04-23 15-48-32](https://github.com/user-attachments/assets/1a823a5f-09a6-48c4-8c87-7a0cae72bbf6)
![Screenshot from 2025-04-23 15-48-42](https://github.com/user-attachments/assets/a66785cb-1b84-4a61-89b9-1b3ddcf6a95b)


## 🛠️ Tech Stack
React.js – Front-end UI

Tailwind CSS – Styling

Redux – State management

jsPDF + html2canvas – PDF export

qrcode.react – QR Code generator

Cloudinary – PDF upload and hosting

## 📁 Project Structure

```
.
├── components/
│   ├── InvoiceForm.jsx
│   ├── InvoicePreview.jsx
│   └── InvoiceSummary.jsx
├── pages/
│   ├── index.jsx           # Home / Invoice creator
│   └── list.jsx            # List of previously created invoices
├── utils/
│   └── uploadToCloudinary.js
├── public/
├── .env                   # Your secrets (not pushed to Git)
├── .gitignore
└── README.md

```

## 🧑‍💻 Getting Started

1. Clone the repository
```
git clone https://github.com/yourusername/invoice-generator.git
cd invoice-generator
```
2. Install dependencies
```
npm install
```
3. Create .env file
```
touch .env
```

## Add your Cloudinary credentials:

```
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
⚠️ Make sure .env is in .gitignore so you don't push secrets to GitHub.
```

4. Run the app
```
npm run dev
```

## ☁️ Cloudinary Setup

Go to https://cloudinary.com/

Create an unsigned upload preset

Upload preset → Mode: Unsigned

Allow file types: PDF

Upload mode: Auto or Raw

Save

Copy your cloud name and preset name into .env

## 🧪 Testing
Try adding sample invoices. Export, view, scan QR. All data is stored in localStorage.

## 💡 Future Enhancements
Backend support with user login

Share invoices via email

More themes & templates

## 🙌 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.
