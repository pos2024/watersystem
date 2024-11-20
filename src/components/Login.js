import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import UserRegistration from "./UserRegistration"; // Import the UserRegistration component
import loginImage from "../assets/loginImage.jpg"; // Adjust path for login image (example)
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import AOS styles

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle between Login and SignUp
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [message, setMessage] = useState(""); // State for displaying messages

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with a duration of 1000ms
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Successfully logged in
      setMessage(`Welcome back, ${user.email}`);
      localStorage.setItem("user", JSON.stringify(user)); // Store user session in localStorage
    } catch (error) {
      setMessage(`Login failed: ${error.message}`); // Show error message if login fails
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(true); // Switch to sign-up form
  };

  const toggleLogin = () => {
    setIsSignUp(false); // Switch back to login form
  };

  return (
    <div
      className="flex justify-center items-center h-auto bg-gray-100"
      data-aos="zoom-in-left" // Add AOS animation to the parent container
    >
      <div className="w-full max-w-screen-xl flex bg-white rounded-md shadow-lg">
        {/* Left Side: Form (Login or Registration) */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between h-[550px]">
          {/* Conditionally render Login form or UserRegistration form */}
          {isSignUp ? (
            <UserRegistration setIsSignUp={setIsSignUp} />
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Login</h2>
              {message && (
                <div
                  className={`mb-4 p-2 rounded ${
                    message.includes("failed") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {message}
                </div>
              )}
              <form onSubmit={handleLogin}>
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

                {/* Password Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                  >
                    Login
                  </button>
                </div>
              </form>

              {/* Forgot Password and Sign Up Here Links */}
              <div className="mt-4 text-center">
                <span
                  className="text-sm text-blue-500 cursor-pointer hover:underline"
                  onClick={() => alert("Forgot Password clicked")}
                >
                  Forgot Password?
                </span>
                <div className="mt-2">
                  <span
                    className="text-sm text-blue-500 cursor-pointer hover:underline"
                    onClick={toggleSignUp} // Switch to the sign-up form
                  >
                    Don't have an account? Sign Up Here
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Image */}
        <div
          className="w-full md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginImage})` }}
        >
          {/* Content inside the div will sit on top of the background image */}
        </div>
      </div>
    </div>
  );
};

export default Login;
