import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../firebase"; // Adjust path to your Firebase config file
import CustomModal from "./CustomModal"; // Import the CustomModal component
import SubscriptionForm from "./SubscriptionForm"; // Import SubscriptionForm component
import CustomSubscription from "./CustomSubscription";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [customSubscriptions, setCustomSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Track the current user
  const [loading, setLoading] = useState(true); // Add a loading state

  const auth = getAuth();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the logged-in user
      setLoading(false); // Authentication state is resolved
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [auth]);

  // Fetch subscriptions from Firestore when the user is available
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subscriptions"));
        const subscriptionsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Separate custom and admin subscriptions
        const custom = subscriptionsList.filter(
          (subscription) =>
            subscription.subscription_name === "Custom Subscription" &&
            subscription.created_by === user?.uid // Only show user's custom subscription
        );
        const admin = subscriptionsList.filter(
          (subscription) => subscription.subscription_name !== "Custom Subscription"
        );

        setCustomSubscriptions(custom);
        setSubscriptions(admin);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, [user]);

  // Open the modal and set the selected subscription
  const handleSubscribeNow = (subscription) => {
    setSelectedSubscription(subscription);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading subscriptions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Available Subscriptions
        </h2>

        {/* Admin-created subscriptions */}
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Admin Subscriptions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{subscription.subscription_name}</h3>
              <p className="text-gray-600">
                Price: <span className="font-bold">₱{subscription.total_price}</span>
              </p>
              <p className="text-gray-600">
                Gallons per Week: <span className="font-bold">{subscription.gallons_per_week} Gallons</span>
              </p>
              <p className="text-gray-600">
                Total Gallons: <span className="font-bold">{subscription.total_gallons} Gallons</span>
              </p>
              <p className="text-gray-600">
                Price per Gallon: <span className="font-bold">₱{subscription.price_per_gallon}</span>
              </p>
              <p className="text-gray-600">
                Duration: <span className="font-bold">{subscription.subscription_duration} months</span>
              </p>
              <p className="text-gray-600">
                Loyalty Points: <span className="font-bold">{subscription.total_loyalty_points} Points</span>
              </p>

              <button
                onClick={() => handleSubscribeNow(subscription)}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          ))}
        </div>

        {/* User's custom subscription */}
        {user && (
          <>
            <h3 className="text-2xl font-semibold text-gray-700 mb-6">Your Custom Subscription</h3>
            {customSubscriptions.length === 0 ? (
              <div className="text-center text-gray-600 mb-12">
                You haven't created a custom subscription yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {customSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{subscription.subscription_name}</h3>
                    <p className="text-gray-600">
                      Price: <span className="font-bold">₱{subscription.total_price}</span>
                    </p>
                    <p className="text-gray-600">
                      Gallons per Week: <span className="font-bold">{subscription.gallons_per_week} Gallons</span>
                    </p>
                    <p className="text-gray-600">
                      Total Gallons: <span className="font-bold">{subscription.total_gallons} Gallons</span>
                    </p>
                    <p className="text-gray-600">
                      Price per Gallon: <span className="font-bold">₱{subscription.price_per_gallon}</span>
                    </p>
                    <p className="text-gray-600">
                      Duration: <span className="font-bold">{subscription.subscription_duration} months</span>
                    </p>
                    <p className="text-gray-600">
                      Loyalty Points: <span className="font-bold">{subscription.total_loyalty_points} Points</span>
                    </p>

                    <button
                      onClick={() => handleSubscribeNow(subscription)}
                      className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Subscribe Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Custom Subscription Form */}
        <CustomSubscription />
      </div>

      {/* CustomModal to handle the subscription form */}
      <CustomModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        <SubscriptionForm subscription={selectedSubscription} closeModal={() => setIsModalOpen(false)} />
      </CustomModal>
    </div>
  );
};

export default Subscription;
