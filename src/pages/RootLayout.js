import React from "react";
import UsersNavigation from "../components/UsersNavigation"
import { Outlet } from "react-router-dom"; // Outlet renders the nested route component

const RootLayout = () => {
  return (
    <div>
      <UsersNavigation /> {/* This will display the navigation bar */}
      <main className="pt-16"> {/* Add padding to avoid content being hidden under the fixed header */}
        <Outlet /> {/* This will render the current route's component */}
      </main>
    </div>
  );
};

export default RootLayout;
