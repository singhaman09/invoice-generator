import Header from './header';
import Footer from './footer';

export default function Layout({ children, user }) {
  return (
    <div>
      <Header user={user} />
      <div className="pt-20 px-4 min-h-screen overflow-y-hidden">{children}</div>
      <Footer />
    </div>
  );
}
