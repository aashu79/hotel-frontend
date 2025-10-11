import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import MobileOrderButton from "../components/MobileOrderButton/MobileOrderButton";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* <MobileOrderButton /> */}
    </div>
  );
};

export default MainLayout;
