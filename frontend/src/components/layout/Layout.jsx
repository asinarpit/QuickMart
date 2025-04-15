import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';


const Layout = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout; 