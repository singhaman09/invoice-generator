import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import InvoicePage from './pages/invoice';
import './redux/slices/i18n';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<InvoicePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
