import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import db from "../firebase"; // Adjust the path to your Firebase config

// Create the context
const UserContext = createContext(null);

// Hook for consuming the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking local storage for a logged-in user
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem("currentUser");

      if (storedUser) {
        const userData = JSON.parse(storedUser);

        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", userData.id));
          if (userDoc.exists()) {
            setUser({ ...userData, ...userDoc.data() });
          } else {
            console.error("User document not found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
