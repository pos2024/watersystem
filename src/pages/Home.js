import React, { useState } from "react";
import CustomModal2 from "../components/CustomModal2"; // Import CustomModal2 component
import Login from "../components/Login"; // Your Login component
import UsersNavigation from "../components/UsersNavigation";
import HeroSection from "../components/HeroSection";
import Subscription from '../components/Subscription'
import CreateProduct from "../components/CreateProduct";
import Buy from "../components/Buy";
import OrderList from "./OrderList";
import AddressForm from "./AddressForm";
import UserRegistration from "../components/UserRegistration";
import Footer from "../components/Footer";
import GenerateReferralCode from "../components/GenerateReferralCode";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true); // Open the modal when button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="h-auto w-full flex flex-col bg-gray-100">
      <UsersNavigation openModal={openModal} /> {/* Pass openModal function as prop */}
      <HeroSection />
      <Subscription/>
      <Buy/>
     
      <GenerateReferralCode/>
 <Footer/>
     

      {/* Login Modal */}
      <CustomModal2 isOpen={isModalOpen} onRequestClose={closeModal}>
        <Login /> {/* Render the Login component inside the modal */}
      </CustomModal2>
    </div>
  );
};

export default Home;
