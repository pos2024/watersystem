import React, { useState } from 'react';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import db from '../firebase'; // Adjust path to your Firebase config file

const SubscriptionManagement = () => {
  // State for form inputs
  const [subscriptionName, setSubscriptionName] = useState('');
  const [gallonsPerWeek, setGallonsPerWeek] = useState('');
  const [pricePerGallon, setPricePerGallon] = useState('');
  const [duration, setDuration] = useState(1); // Subscription duration in months
  const [bonusPoints, setBonusPoints] = useState(0); // Bonus loyalty points for certain duration
  const [message, setMessage] = useState('');

  // Handle subscription creation
  const handleCreateSubscription = async (e) => {
    e.preventDefault();

    // Calculate total gallons delivered during the subscription period
    const totalGallons = gallonsPerWeek * 4 * duration; // Assuming 4 weeks in a month

    // Calculate the total price of the subscription
    const totalPrice = totalGallons * pricePerGallon;

    // Calculate loyalty points based on gallons and bonus points
    const pointsPerGallon = 1; // 1 point per gallon delivered
    const totalLoyaltyPoints = totalGallons * pointsPerGallon + bonusPoints;

    // Subscription data to save in Firestore
    const subscriptionData = {
      subscription_name: subscriptionName,
      gallons_per_week: parseInt(gallonsPerWeek),
      total_gallons: totalGallons,
      price_per_gallon: parseFloat(pricePerGallon),
      total_price: totalPrice,
      points_per_gallon: pointsPerGallon,
      bonus_points: bonusPoints,
      total_loyalty_points: totalLoyaltyPoints,
      subscription_duration: duration,
      delivery_frequency: "Weekly",
      status: "active", // Active by default, can change based on admin control
      created_at: Timestamp.fromDate(new Date()) // Timestamp when subscription was created
    };

    try {
      // Save subscription data to Firestore
      await setDoc(doc(db, "subscriptions", subscriptionName), subscriptionData);
      setMessage("Subscription created successfully!");
    } catch (error) {
      console.error("Error creating subscription:", error);
      setMessage(`Error creating subscription: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Subscription</h2>
        {message && (
          <div
            className={`mb-4 p-2 rounded ${
              message.includes("Error") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleCreateSubscription}>
          {/* Subscription Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subscription Name</label>
            <input
              type="text"
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Gallons Per Week */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gallons per Week</label>
            <input
              type="number"
              value={gallonsPerWeek}
              onChange={(e) => setGallonsPerWeek(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Price Per Gallon */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price per Gallon</label>
            <input
              type="number"
              value={pricePerGallon}
              onChange={(e) => setPricePerGallon(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Subscription Duration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subscription Duration (Months)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            />
          </div>

          {/* Bonus Loyalty Points */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bonus Loyalty Points</label>
            <input
              type="number"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Create Subscription
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionManagement;
