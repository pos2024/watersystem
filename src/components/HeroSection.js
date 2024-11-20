import React from "react";
import background from "../assets/herobackground.jpg"; // Import your image

const HeroSection = () => {
  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',  // Ensures the image covers the entire section
        backgroundPosition: 'center',  // Centers the image
        backgroundAttachment: 'fixed', // Optional: Adds a parallax effect
        height: '100vh', // Ensure the section takes the full height of the screen
      }}
    >
      <div className="text-center text-white p-8 bg-opacity-60 bg-black rounded-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Water Refilling Service</h1>
        <p className="text-lg">Fresh and clean water delivered to your doorsteps.</p>
        <button className="mt-4 bg-[#28aff7] text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
