import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const SubscriptionForm = ({ subscription, closeModal }) => {
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to subscribe.");
      closeModal();
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        alert("User data not found.");
        closeModal();
        return;
      }

      const userData = userDoc.data();
      const userName = userData?.personal_details?.name || "Unknown User";

      let referralUserRef = null;
      let referralPoints = 0;
      let referralPointsPending = 0;
      let salesDocId = "";

      // Create the sales document first
      const salesDocRef = await addDoc(collection(db, "sales"), {
        type: "subscription", // Set the type field to subscription
        userId: user.uid,
        subscriptionName: subscription.subscription_name,
        totalPrice: subscription.total_price,
        totalGallons: subscription.gallons_per_week * parseInt(subscription.subscription_duration) * 4, // Calculate the total gallons
        paymentMethod,
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "paid",
        startDate: Timestamp.fromDate(new Date(deliveryDate)),
        timestamp: Timestamp.fromDate(new Date()),
      });

      salesDocId = salesDocRef.id;

      if (referralCode.trim() !== "") {
        const referralQuery = query(
          collection(db, "users"),
          where("referral_details.referral_code", "==", referralCode)
        );
        const referralQuerySnapshot = await getDocs(referralQuery);
      
        if (referralQuerySnapshot.empty) {
          alert("Invalid referral code.");
          setReferralCode("");
          setLoading(false);
          return;
        }
      
        referralUserRef = referralQuerySnapshot.docs[0].ref;
        referralPoints = Math.floor(subscription.total_price * 0.1);
      
        if (paymentMethod === "cash_on_delivery") {
          referralPointsPending = referralPoints;
        }

        // Add referral details to the sales document
        await updateDoc(salesDocRef, {
          referral_details: {
            referralCode,
            referralPointsPending,
            referralPoints,
            userName,
            referralUserRef: referralUserRef?.id,
            salesDocId,
          },
        });
      }

      const subscriptionDuration = parseInt(subscription.subscription_duration);
      const totalDeliveries = subscriptionDuration * 4;
      const totalGallons = subscription.gallons_per_week * totalDeliveries;
      const startDate = new Date(deliveryDate);

      const deliverySchedule = Array.from({ length: totalDeliveries }, (_, i) => {
        const deliveryDateObj = new Date(startDate);
        deliveryDateObj.setDate(startDate.getDate() + i * 7);
        return deliveryDateObj.toISOString().split("T")[0];
      });

      const deliveryStatus = new Array(totalDeliveries).fill("Pending");
      const paymentStatus = paymentMethod === "cash_on_delivery" ? "pending" : "paid";

      // Add the subscription details to the user's record
      await updateDoc(userRef, {
        subscription_status: "active",
        total_gallons: totalGallons,
        payment_details: {
          amount_paid: paymentMethod === "cash_on_delivery" ? 0 : subscription.total_price,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          payment_date: Timestamp.fromDate(new Date()),
        },
        delivery_schedule: deliverySchedule,
        delivery_status: deliveryStatus,
        subscription_details: {
          subscription_name: subscription.subscription_name,
          total_price: subscription.total_price,
          gallons_per_week: subscription.gallons_per_week,
        },
        ...(referralCode && referralUserRef && {
          "referral_details.referred_by": referralCode,
        }),
      });

      // Update the referral user's points (if applicable)
      if (referralUserRef && paymentStatus === "pending") {
        await updateDoc(referralUserRef, {
          "referral_details.referral_points_pending":
            (await getDoc(referralUserRef)).data()?.referral_details.referral_points_pending +
              referralPointsPending || referralPointsPending,
          "referral_details.referrals_count":
            (await getDoc(referralUserRef)).data()?.referral_details.referrals_count + 1 || 1,
        });
      }

      if (referralUserRef && paymentStatus === "paid") {
        await updateDoc(referralUserRef, {
          "referral_details.referral_points":
            (await getDoc(referralUserRef)).data()?.referral_details.referral_points +
              referralPoints || referralPoints,
          "referral_details.referral_points_pending":
            (await getDoc(referralUserRef)).data()?.referral_details.referral_points_pending - 
              referralPoints || 0,
          "referral_details.referrals_count":
            (await getDoc(referralUserRef)).data()?.referral_details.referrals_count + 1 || 1,
        });
      }

      alert("Subscription successful!");
      closeModal();
    } catch (error) {
      console.error("Failed to process subscription:", error);
      alert("Subscription failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">{subscription?.subscription_name}</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block">Delivery Date</label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="cash_on_delivery">Cash on Delivery</option>
            <option value="credit_card">Credit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block">Referral Code (optional)</label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Subscription"}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
