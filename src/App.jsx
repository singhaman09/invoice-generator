import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import InvoicePage from './pages/invoice';
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './redux/slices/i18n'
import Home from './pages/home';
import List from './pages/list'

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

  if (loading) return <div className="text-center p-8 animate-spin bg-purple-600">Loading...</div>;

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={user ? <InvoicePage /> : <Home/>} />
          <Route path="/invoices" element={ user? <List />: <Home/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

