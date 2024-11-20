import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"; // Import Firebase auth functions

const UsersNavigation = ({ openModal }) => {
  const [user, setUser] = useState(null); // Track the user state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [auth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Log the user out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-[#28aff7] w-full p-6 fixed top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">Water Refilling Station</h1>

        {/* Hamburger Icon for Mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden inline-flex items-center justify-center p-2 w-10 h-10 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-controls="navbar"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav>
          <ul
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } md:flex md:space-x-6 flex-col md:flex-row space-y-4 md:space-y-0 md:p-0 p-4 bg-[#28aff7] md:bg-transparent`}
            id="navbar"
          >
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/userprofile" className="text-white hover:text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link to="#contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
            </li>
            <li>
              {/* Show Login if not logged in, Logout if logged in */}
              {user ? (
                <button onClick={handleLogout} className="text-white hover:text-gray-300">
                  Logout
                </button>
              ) : (
                <button onClick={openModal} className="text-white hover:text-gray-300">
                  Login
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default UsersNavigation;
