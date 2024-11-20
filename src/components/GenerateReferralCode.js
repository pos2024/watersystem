import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions
import  db  from "../firebase"; // Import your Firebase config

const GenerateReferralCode = () => {
  const [referralCode, setReferralCode] = useState(""); // State to display the generated referral code
  const [status, setStatus] = useState(""); // State for displaying status messages

  // Function to generate a random referral code
  const generateCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase(); // Random 8-character alphanumeric code
    return `REF-${randomCode}`;
  };

  // Handle referral code generation and Firestore update
  const handleGenerateReferralCode = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setStatus("Error: No logged-in user found.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        // Check if referral code already exists
        if (userData.referral_details.referral_code) {
          setStatus("Referral code already exists: " + userData.referral_details.referral_code);
          return;
        }

        // Generate and update referral code
        const newReferralCode = generateCode();
        await updateDoc(userDocRef, {
          "referral_details.referral_code": newReferralCode,
        });

        setReferralCode(newReferralCode); // Update state to display the new referral code
        setStatus("Referral code generated successfully!");
      } else {
        setStatus("Error: User document not found.");
      }
    } catch (error) {
      setStatus("Error generating referral code: " + error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Generate Referral Code</h2>
      <button
        onClick={handleGenerateReferralCode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Referral Code
      </button>

      {referralCode && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded">
          Your referral code: <strong>{referralCode}</strong>
        </div>
      )}

      {status && (
        <div className={`mt-4 p-2 rounded ${status.includes("Error") ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-800"}`}>
          {status}
        </div>
      )}
    </div>
  );
};

export default GenerateReferralCode;
