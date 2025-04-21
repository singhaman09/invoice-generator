export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white p-4 mt-8 text-center">
      <p> &copy; {new Date().getFullYear()} InvoiceGen. All rights reserved.</p>
    </footer>
  );
}
