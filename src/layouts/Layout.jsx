import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* Top Nav */}
      <Navbar />

      {/* Responsive Page Container */}
      <main
        className="
          flex-1 w-full mx-auto
          px-3
          sm:px-5
          md:px-8
          lg:px-12
          xl:px-16
          2xl:px-24
          py-4 sm:py-6
          max-w-screen-2xl
        "
      >
        <Outlet />
      </main>

    </div>
  );
}
