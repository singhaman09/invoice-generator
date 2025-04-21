import Header from './header';
import Footer from './footer';

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <div className="pt-20 px-4">{children}</div>
      <Footer />
    </div>
  );
}
