import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const CustomSubscription = () => {
  const [gallonsPerWeek, setGallonsPerWeek] = useState("");
  const [duration, setDuration] = useState("");
  const [bonusPoints, setBonusPoints] = useState("");
  const [message, setMessage] = useState("");
  const [existingSubscription, setExistingSubscription] = useState(null);

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const subscriptionRef = doc(db, "subscriptions", user.uid);
        const subscriptionDoc = await getDoc(subscriptionRef);

        if (subscriptionDoc.exists()) {
          setExistingSubscription(subscriptionDoc.data());
        }
      };

      fetchSubscription();
    }
  }, [user, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in to create a subscription.");
      return;
    }

    const gallons = parseInt(gallonsPerWeek);
    const subscriptionDuration = parseInt(duration);
    const bonus = parseInt(bonusPoints);

    if (isNaN(gallons) || isNaN(subscriptionDuration)) {
      setMessage("Please provide valid inputs for gallons and duration.");
      return;
    }

    const totalGallons = gallons * 4 * subscriptionDuration; // 4 weeks in a month
    const pricePerGallon = 22.5; // Fixed price per gallon
    const totalPrice = totalGallons * pricePerGallon;
    const pointsPerGallon = 0.1; // Fixed points per gallon
    const totalLoyaltyPoints = totalGallons * pointsPerGallon + (bonus || 0);

    const currentDate = new Date();
    if (isNaN(currentDate.getTime())) {
      console.error("Invalid date value:", currentDate);
      setMessage("There was an error with the date value.");
      return;
    }

    const subscriptionData = {
      subscription_name: "Custom Subscription",
      gallons_per_week: gallons,
      total_gallons: totalGallons,
      price_per_gallon: pricePerGallon,
      total_price: totalPrice,
      points_per_gallon: pointsPerGallon,
      bonus_points: bonus || 0,
      total_loyalty_points: totalLoyaltyPoints,
      subscription_duration: subscriptionDuration,
      delivery_frequency: "Weekly",
      status: "inactive", // Since it does not auto-subscribe the user
      created_at: currentDate.toISOString(),
      created_by: user.uid, // Added the created_by field
    };

    try {
      // Save custom subscription to the 'subscriptions' collection
      await setDoc(doc(db, "subscriptions", user.uid), subscriptionData);

      setMessage("Custom subscription created successfully!");
      setExistingSubscription(subscriptionData); // Update local state
    } catch (error) {
      console.error("Error creating subscription:", error);
      setMessage(`Error creating subscription: ${error.message}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Custom Subscription</h1>
      {existingSubscription ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Custom Subscription</h2>
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <p><strong>Subscription Name:</strong> {existingSubscription.subscription_name}</p>
            <p><strong>Gallons per Week:</strong> {existingSubscription.gallons_per_week}</p>
            <p><strong>Total Gallons:</strong> {existingSubscription.total_gallons}</p>
            <p><strong>Price per Gallon:</strong> ₱{existingSubscription.price_per_gallon}</p>
            <p><strong>Total Price:</strong> ₱{existingSubscription.total_price}</p>
            <p><strong>Points per Gallon:</strong> {existingSubscription.points_per_gallon}</p>
            <p><strong>Total Loyalty Points:</strong> {existingSubscription.total_loyalty_points}</p>
            <p><strong>Subscription Duration:</strong> {existingSubscription.subscription_duration} month(s)</p>
            <p><strong>Status:</strong> {existingSubscription.status}</p>
            <p><strong>Created At:</strong> {new Date(existingSubscription.created_at).toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gallons per Week</label>
            <input
              type="number"
              value={gallonsPerWeek}
              onChange={(e) => setGallonsPerWeek(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Duration (months)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bonus Points (optional)</label>
            <input
              type="number"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Subscription
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
};

export default CustomSubscription;
