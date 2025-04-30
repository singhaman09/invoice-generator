import { Link, useNavigate } from 'react-router-dom';
import { auth, provider,facebookProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import icon from '../assets/invoice.png';
import { useTranslation } from "react-i18next";

export default function Header({ user }) {
   const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        navigate('/');
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      if (result.user) {
        navigate('/');
      }
    } catch (error) {
      console.error("Facebook Login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="bg-purple-800 text-white p-4 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-9xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={icon} alt="InvoiceGen Logo" className="h-10 w-10" />
          <h1 className="text-xl font-bold">{t("InvoiceGen")}</h1>
        </div>
        <nav className="space-x-6 text-sm sm:text-base flex items-center">
          <Link to="/" className="transition-colors hover:bg-yellow-600 hover:bg-linear-to-bl from-violet-500 to-fuchsia-500 px-3 py-2 rounded-lg font-semibold">{t("Home")}</Link>
          <Link to="/invoices" className=" hover:bg-yellow-600 hover:bg-linear-to-bl from-violet-500 to-fuchsia-500 px-3 py-2 rounded-lg font-semibold">{t("Invoices")}</Link>
          {user ? (
            <>
              <span className="text-sm font-bold border-2 py-2 px-2 bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-lg cursor-pointer hover:scale-103">{user.displayName}</span>
              <button onClick={handleLogout} className="hover:bg-red-600 bg-red-500 px-3 py-2 rounded-lg font-semibold cursor-pointer border-2">{t("Logout")}</button>
            </>
          ) : (
            <div className="flex space-x-4">
            <button onClick={handleGoogleLogin} className="cursor-pointer hover:bg-yellow-600 bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-lg px-3 py-2 font-semibold text-white brightness-105 hover:scale-105">
              Sign in with Google
            </button>
            <button 
            onClick={handleFacebookLogin} 
            className="cursor-pointer hover:bg-yellow-600 bg-linear-to-bl from-violet-500 to-fuchsia-500 rounded-lg px-3 py-2 font-semibold text-white brightness-105 hover:scale-105"
          >
            Sign in with Facebook
          </button>
          </div>
          )}
        </nav>
      </div>
    </header>
  );
}
