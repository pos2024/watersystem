import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import db from "../firebase"; // Your Firebase config file
import Select from "react-select";

// List of Barangays in Balungao, Pangasinan
const barangays = [
  { value: "Angayan Norte", label: "Angayan Norte" },
  { value: "Angayan Sur", label: "Angayan Sur" },
  { value: "Capulaan", label: "Capulaan" },
  { value: "Esmeralda", label: "Esmeralda" },
  { value: "Kita-kita", label: "Kita-kita" },
  { value: "Mabini", label: "Mabini" },
  { value: "Mauban", label: "Mauban" },
  { value: "Poblacion", label: "Poblacion" },
  { value: "Pugaro", label: "Pugaro" },
  { value: "Rajal", label: "Rajal" },
  { value: "San Andres", label: "San Andres" },
  { value: "San Aurelio 1st", label: "San Aurelio 1st" },
  { value: "San Aurelio 2nd", label: "San Aurelio 2nd" },
  { value: "San Aurelio 3rd", label: "San Aurelio 3rd" },
  { value: "San Joaquin", label: "San Joaquin" },
  { value: "San Julian", label: "San Julian" },
  { value: "San Leon", label: "San Leon" },
  { value: "San Marcelino", label: "San Marcelino" },
  { value: "San Miguel", label: "San Miguel" },
  { value: "San Raymundo", label: "San Raymundo" },
];

const UserRegistration = ({ setIsSignUp }) => { // Receive setIsSignUp as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userId = user.uid;

      const userData = {
        personal_details: {
          name: name,
          phone_number: phone,
          email: email,
          address: `${houseNumber}, ${selectedBarangay ? selectedBarangay.label : ''}, Balungao, Pangasinan`,
        },
        subscription_status: "inactive",
        payment_details: {
          payment_method: "none",
          amount_paid: 0,
          payment_date: Timestamp.fromDate(new Date()),
          payment_status: "unpaid",
        },
        loyalty_points: {
          points_balance: 0,
          points_history: [],
        },
        referral_details: {
          referral_code: "",
          referrals_count: 0,
          referral_points: 0,
        },
      };

      await setDoc(doc(db, "users", userId), userData);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("Registration successful!");
    } catch (error) {
      console.error("Error registering user:", error);
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6  w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Register</h2>
        {message && (
          <div
            className={`mb-4 p-2 rounded ${message.includes("failed") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Password and Phone Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                required
              />
            </div>
          </div>

          {/* House Number and Barangay Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">House Number</label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Barangay</label>
              <Select
                options={barangays}
                value={selectedBarangay}
                onChange={setSelectedBarangay}
                placeholder="Select Barangay"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Register
            </button>
          </div>
        </form>

        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <span
            className="text-sm text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsSignUp(false)} // Switch to login form when clicked
          >
            Already have an account? Sign In Here
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
