import React, { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import UserProfile from "./components/UserProfile";
import Delivery from "./components/Delivery";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import db from "./firebase";
import RootLayout from "./pages/RootLayout"
import AdminDashBoard from "./components/Admin/AdminDashBoard";

// Admin router
const adminRouter = createBrowserRouter([
  { path: "/", element: <AdminDashBoard /> }, // Admin dashboard as the default page
  { path: "*", element: <NotFound /> }, // Fallback for unmatched routes
]);

// User router
const userRouter = createBrowserRouter([
  { path: "/", element: <UserProfile /> }, // User dashboard as the default page
  { path: "*", element: <NotFound /> }, // Fallback for unmatched routes
]);

// Public router (Home component as default)
const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Use RootLayout to wrap the public pages
    children: [
      { path: "/", element: <Home /> }, // Home as the default page
      { path: "/login", element: <Login /> },
      { path: "/userprofile", element: <UserProfile /> }, // Login route
    ],
  },
  { path: "*", element: <NotFound /> }, // Fallback for unmatched routes
]);

const App = () => {
  const [userRole, setUserRole] = useState(null); // Tracks the role ('admin' or 'user')
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user data from Firestore
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role); // Set role ('admin' or 'user')
          } else {
            console.error("User document not found.");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null); 
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  let router;
  if (userRole === "admin") {
    router = adminRouter;
  } else if (userRole === "user") {
    router = userRouter;
  } else {
    router = publicRouter;
  }

  return <RouterProvider router={router} />;
};

export default App;
