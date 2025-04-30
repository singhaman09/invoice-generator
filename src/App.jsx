import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout";
import InvoicePage from "./pages/invoice";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./redux/slices/i18n";
import Home from "./pages/home";
import List from "./pages/list";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-22 w-22 rounded-full animate-bounce bg-purple-600 text-white flex items-center justify-center">
          Loading...
        </div>
      </div>
    );

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={user ? <InvoicePage /> : <Home />} />
          <Route path="/invoices" element={user ? <List /> : <Home />} />
        </Routes>
      </Layout>

      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;
