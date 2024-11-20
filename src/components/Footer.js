import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; 


const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Brand Section */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold mb-2">WaterRefill</h2>
            <p>Your trusted source for clean water delivered to your doorsteps.</p>
          </div>

          {/* Navigation Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Navigation</h3>
            <ul>
              <li>
                <a
                  href="/about"
                  className="block py-1 hover:text-blue-400 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="block py-1 hover:text-blue-400 transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="block py-1 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="block py-1 hover:text-blue-400 transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <ul>
              <li className="block py-1">Phone: (123) 456-7890</li>
              <li className="block py-1">Email: support@waterrefill.com</li>
              <li className="block py-1">Address: 123 Main St, Balungao, Pangasinan</li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-blue-600 hover:text-blue-400 transition-colors"
              >
                <i className="fab fa-facebook-f text-2xl"></i>
              </a>
              <a
                href="https://twitter.com"
                className="text-blue-400 hover:text-blue-200 transition-colors"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a
                href="https://instagram.com"
                className="text-pink-500 hover:text-pink-300 transition-colors"
              >
                <i className="fab fa-instagram text-2xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 border-t border-gray-600 pt-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} WaterRefill. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
