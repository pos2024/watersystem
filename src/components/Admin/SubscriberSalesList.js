import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const SubscriberSalesList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const db = getFirestore();
      const salesQuery = query(collection(db, "sales"), where("type", "==", "subscription"));
      
      try {
        const querySnapshot = await getDocs(salesQuery);
        const salesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubscriptions(salesData);
      } catch (error) {
        console.error("Error fetching subscriptions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleMarkAsPaid = async (subscription) => {
    const db = getFirestore();
    const userRef = doc(db, "users", subscription.userId);  // Reference to the user's document

    // Check if referral code exists and is valid
    if (subscription.referral_details && subscription.referral_details.referralCode) {
      const referralCode = subscription.referral_details.referralCode;
      const referralUserRef = doc(db, "users", subscription.referral_details.referralUserRef); // Reference to the referrer

      try {
        // Fetch the referral user's details
        const referralUserDoc = await getDoc(referralUserRef);
        const referralUserData = referralUserDoc.data();

        if (referralUserData) {
          // Check if the referral code matches and add referral points
          if (referralUserData.referral_details.referral_code === referralCode) {
            const updatedReferralPoints = referralUserData.referral_details.referral_points + subscription.referral_details.referralPoints;
            const updatedReferralPointsPending = referralUserData.referral_details.referral_points_pending - subscription.referral_details.referralPointsPending;

            // Update the referrer user's referral points and pending points
            await updateDoc(referralUserRef, {
              "referral_details.referral_points": updatedReferralPoints,
              "referral_details.referral_points_pending": updatedReferralPointsPending,
              "referral_details.referrals_count": referralUserData.referral_details.referrals_count + 1,
            });

            // Update the subscription document to mark as paid
            await updateDoc(doc(db, "sales", subscription.id), {
              paymentStatus: "paid",
            });

            alert("Subscription marked as paid and referral points updated!");
          } else {
            alert("Referral code does not match.");
          }
        } else {
          alert("Referral user not found.");
        }
      } catch (error) {
        console.error("Error updating referral points:", error);
        alert("Error marking as paid.");
      }
    } else {
      alert("No referral code provided.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Subscription List</h2>
      <div>
        {subscriptions.length === 0 ? (
          <p>No subscriptions found.</p>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscription-item">
              <h3>{subscription.subscriptionName}</h3>
              <p><strong>Payment Method:</strong> {subscription.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {subscription.paymentStatus}</p>
              {subscription.referral_details && (
                <div>
                  <h4>Referral Details</h4>
                  <p><strong>Referral Code:</strong> {subscription.referral_details.referralCode}</p>
                  <p><strong>Referral Points:</strong> {subscription.referral_details.referralPoints}</p>
                  <p><strong>Referral Points Pending:</strong> {subscription.referral_details.referralPointsPending}</p>
                  <p><strong>Referred By:</strong> {subscription.referral_details.userName}</p>
                </div>
              )}
              <p><strong>Start Date:</strong> {new Date(subscription.startDate.seconds * 1000).toLocaleString()}</p>
              <p><strong>Total Gallons:</strong> {subscription.totalGallons}</p>
              <p><strong>Total Price:</strong> ₱{subscription.totalPrice}</p>
              <p><strong>Sales Doc ID:</strong> {subscription.salesDocId}</p>
              
              {/* Mark as Paid Button */}
              {subscription.paymentStatus === "pending" && (
                <button
                  onClick={() => handleMarkAsPaid(subscription)}
                  className="bg-green-500 text-white py-1 px-4 rounded"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubscriberSalesList;
