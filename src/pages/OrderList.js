import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import db from "../firebase"; // Default import for Firestore instance
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore"; // Added getDoc import


const OrderList = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [userAddress, setUserAddress] = useState(""); // State for user address

  // Get the current user's ID
  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        // Create a query to filter orders by user ID
        const ordersCollection = collection(db, "sales");
        const ordersQuery = query(ordersCollection, where("userId", "==", user.uid));
        
        // Get the orders from Firestore
        const querySnapshot = await getDocs(ordersQuery);
        const ordersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setOrders(ordersList);
      } catch (err) {
        setError("Error fetching orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAddress = async () => {
      try {
        // Get the user's address from the users collection in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserAddress(userData.personal_details.address); // Set address from user's data
        }
      } catch (err) {
        setError("Error fetching user address.");
        console.error("Error fetching user address:", err);
      }
    };

    fetchOrders();
    fetchUserAddress();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "sales", orderId);
      await updateDoc(orderRef, {
        status: "Cancelled",
      });
      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      setError("Error canceling order.");
      console.error("Error canceling order:", err);
    }
  };

  // Helper function to determine the status text color
  const getStatusColor = (status) => {
    switch (status) {
      case "Ready to Deliver":
        return "text-blue-500";
      case "Delivered":
        return "text-green-500";
      case "Cancelled":
        return "text-red-500";
      default:
        return "text-orange-500"; // For Pending status
    }
  };

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 border rounded-lg shadow-lg flex flex-col items-start bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800">{order.productName}</h2>
              <p className="text-gray-600">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Total Price: ₱{order.totalPrice.toFixed(2)}</p>
              <p className="text-gray-600">Payment Option: {order.paymentOption}</p>
              <p className={`font-semibold ${getStatusColor(order.status)}`}>Status: {order.status}</p>
              {/* Display the address */}
              <p className="text-gray-600">Delivery Address: {userAddress}</p> {/* Showing user's address */}
              <p className="text-gray-600">Order Date: {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>

              {/* Cancel Button */}
              {order.status !== "Cancelled" && (
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className={`mt-4 px-6 py-2 rounded-md text-white ${order.status === "Ready to Deliver" || order.status === "Delivered" ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-700'}`}
                  disabled={order.status === "Ready to Deliver" || order.status === "Delivered"}
                >
                  {order.status === "Ready to Deliver" || order.status === "Delivered" ? "Cannot Cancel" : "Cancel Order"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
