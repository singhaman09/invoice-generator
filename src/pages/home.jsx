import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-yellow-50 px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-purple-800 mb-6 animate-fade-in-down">
          Welcome to <span className="text-yellow-500 cursor-pointer">InvoiceGen</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-10 animate-fade-in-up">
          Effortlessly create, customize, and preview professional invoices in seconds.
          <br />
          All from your browser — no installation needed.
          <br/>
          <br/>
          <span className="text-purple-800 font-bold text-xl ">Sign In with Google to Continue</span>
        </p>
    </div>
    </div>
  );
}
