export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white p-4 mt-8 text-center">
      <p className="text-sm md:text-base">
        &copy; {new Date().getFullYear()} <span className="font-semibold">InvoiceGen</span>. All rights reserved.
      </p>
    </footer>
  );
}
