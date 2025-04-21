import { Link } from 'react-router-dom';
import icon from '../assets/invoice.png';

export default function Header() {
  return (
    <header className="bg-purple-800 text-white p-4 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-9xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={icon} alt="InvoiceGen Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold">InvoiceGen</h1>
        </div>
        <nav className="space-x-6 text-sm sm:text-base">
          <Link to="/" className="hover:text-yellow-300 transition-colors">Home</Link>
          <Link to="/invoices" className="hover:text-yellow-300 transition-colors">Invoices</Link>
        </nav>
      </div>
    </header>
  );
}
