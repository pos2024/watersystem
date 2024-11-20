import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import db from '../firebase'; // Your Firebase config file
import Logout from './Logout';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // User is logged in
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserData(userData); // Set user data if document exists
          } else {
            setError('No user data found!');
          }
        } catch (err) {
          setError('Failed to fetch user data');
        } finally {
          setLoading(false); // Stop loading when data is fetched or error occurs
        }
      } else {
        setUser(null); // No user is logged in
        setLoading(false);
        setError('No user is logged in');
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const generateDeliveryDates = (startDate) => {
    if (!startDate) return [];

    let deliveryDates = [];
    let currentDate = new Date(startDate);

    // If subscription start date is in the past, start from today's date
    if (currentDate < new Date()) {
      currentDate = new Date();
    }

    // Generate the next 4 delivery dates (weekly)
    for (let i = 0; i < 4; i++) {
      deliveryDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7); // Move to next week
    }

    return deliveryDates;
  };

  // Get the next scheduled delivery date that is marked as "Pending"
  const getNextDeliveryDate = (deliveryDates, deliveryStatus) => {
    if (deliveryDates && deliveryStatus) {
      for (let i = 0; i < deliveryDates.length; i++) {
        if (deliveryStatus[i] !== 'Delivered') {
          return deliveryDates[i];
        }
      }
    }
    return null; // Return null if all deliveries are marked as "Delivered"
  };

  // **Main Fix:** Function to calculate remaining gallons
  const calculateRemainingGallons = (totalGallons, deliveryStatus, gallonsPerWeek) => {
    let remainingGallons = totalGallons; // Start with total gallons from subscription
    let completedDeliveries = 0;

    // Count how many deliveries are marked as "Delivered"
    deliveryStatus.forEach(status => {
      if (status === 'Delivered') {
        completedDeliveries++;
      }
    });

    // Subtract the gallons for each completed delivery
    remainingGallons -= completedDeliveries * gallonsPerWeek;

    return remainingGallons;
  };

  // Get the required fields from userData
  const deliveryDates = userData?.delivery_schedule || [];
  const deliveryStatus = userData?.delivery_status || [];
  const gallonsPerWeek = userData?.gallons_per_week || 6;
  const totalGallons = userData?.total_gallons || 0; // Default total gallons from user subscription

  // Calculate the remaining gallons based on total_gallons and delivery status
  const remainingGallons = calculateRemainingGallons(totalGallons, deliveryStatus, gallonsPerWeek);

  const nextDelivery = getNextDeliveryDate(deliveryDates, deliveryStatus); // Get the next delivery date that is not "Delivered"

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">User Profile</h1>

      <div className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">Personal Details</h2>
  <p><strong>Name:</strong> {userData?.personal_details?.name || 'No name available'}</p>
  <p><strong>Email:</strong> {userData?.personal_details?.email || 'No email available'}</p>
  <p><strong>Phone:</strong> {userData?.personal_details?.phone_number || 'No phone number available'}</p>
  <p><strong>Address:</strong> {userData?.personal_details?.address || 'No address available'}</p>
</div>


      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Subscription Status</h2>
        <p className={`text-lg font-medium ${userData.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
          {userData.subscription_status === 'active' ? 'Active' : 'Inactive'}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Delivery Schedule</h2>
        <ul className="list-disc pl-5">
          {deliveryDates.length > 0 ? (
            deliveryDates.map((date, index) => (
              <li key={index} className="text-lg">
                <span>{formatDate(date)}</span>
                {deliveryStatus[index] === 'Delivered' && (
                  <span className="text-green-600 ml-4">Delivered</span>
                )}
              </li>
            ))
          ) : (
            <li>No delivery schedule available</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Next Delivery</h2>
        <p className="text-lg">
          {nextDelivery ? formatDate(nextDelivery) : 'No upcoming deliveries'}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Gallons Remaining</h2>
        <p className="text-lg">
          {remainingGallons} gallons left (Total to be delivered: {totalGallons} gallons)
        </p>
      </div>

      <div className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">Payment Information</h2>
  <p><strong>Amount Paid:</strong> ₱{userData?.payment_details?.amount_paid || 'N/A'}</p>
  <p><strong>Payment Date:</strong> {userData?.payment_details?.payment_date ? new Date(userData.payment_details.payment_date.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
  <p><strong>Payment Method:</strong> {userData?.payment_details?.payment_method || 'N/A'}</p>
  <p><strong>Payment Status:</strong> <span className={`${userData?.payment_details?.payment_status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>{userData?.payment_details?.payment_status || 'N/A'}</span></p>
</div>


<div className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">Loyalty Points</h2>
  <p><strong>Points Balance:</strong> {userData?.loyalty_points?.points_balance ?? 'N/A'} points</p>
  <h3 className="text-lg font-semibold mt-2">Points History:</h3>
  <ul className="list-disc pl-5">
    {userData?.loyalty_points?.points_history?.length > 0 ? (
      userData.loyalty_points.points_history.map((history, index) => (
        <li key={index} className="text-lg">{history}</li>
      ))
    ) : (
      <li>No points history available</li>
    )}
  </ul>
</div>


<div className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">Referral Information</h2>
  <p><strong>Referral Code:</strong> {userData?.referral_details?.referral_code || 'N/A'}</p>
  <p><strong>Referral Points:</strong> {userData?.referral_details?.referral_points || 'N/A'}</p>
  <p><strong>Referrals Count:</strong> {userData?.referral_details?.referrals_count || 'N/A'}</p>
</div>

<div className="mb-6">
  <h2 className="text-2xl font-semibold mb-2">Pending Payment</h2>

</div>
<Logout/>
    </div>
  );
};

export default UserProfile;
