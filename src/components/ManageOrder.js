import React, { useState, useEffect } from "react";
import db from '../firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Get orders from Firestore
        const ordersCollection = collection(db, "sales");
        const querySnapshot = await getDocs(ordersCollection);
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

    fetchOrders();
  }, []);

  // Function to handle updating order status
  const handleOrderAction = async (orderId, action) => {
    try {
      const orderRef = doc(db, "sales", orderId);

      let newStatus = "";
      if (action === "cancel") {
        newStatus = "Cancelled";
      } else if (action === "confirm") {
        newStatus = "Ready to Deliver";
      } else if (action === "deliver") {
        newStatus = "Delivered";
      }

      await updateDoc(orderRef, {
        status: newStatus,
      });

      // Update the local state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Error updating order status.");
      console.error("Error updating order status:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total Price</th>
              <th className="px-4 py-2">Payment Option</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Delivery Address</th> {/* New Address Column */}
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-100"
              >
                <td className="px-4 py-2">{order.productName}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">
                  ₱{(order.totalPrice && !isNaN(order.totalPrice) ? order.totalPrice : 0).toFixed(2)}
                </td>
                <td className="px-4 py-2">{order.paymentOption}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">{order.deliveryAddress}</td> {/* Display Address */}
                <td className="px-4 py-2">
                  <div className="space-x-2">
                    {/* Cancel Button */}
                    <button
                      onClick={() => handleOrderAction(order.id, "cancel")}
                      className={`px-4 py-2 rounded-md text-white ${order.status === "Pending" ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-700'}`}
                      disabled={order.status === "Pending"}
                    >
                      Cancel
                    </button>

                    {/* Confirm Button */}
                    <button
                      onClick={() => handleOrderAction(order.id, "confirm")}
                      className={`px-4 py-2 rounded-md text-white ${order.status === "Pending" ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                      disabled={order.status === "Pending"}
                    >
                      Confirm
                    </button>

                    {/* Deliver Button */}
                    <button
                      onClick={() => handleOrderAction(order.id, "deliver")}
                      className={`px-4 py-2 rounded-md text-white ${order.status === "Pending" ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700'}`}
                      disabled={order.status === "Pending"}
                    >
                      Deliver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrder;
