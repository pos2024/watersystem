import React, { useState } from "react";
import db from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const BuyForm = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);

  if (!product) {
    return <p>Product details are missing.</p>;
  }

  const totalPrice = quantity * product.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getAuth().currentUser;
      const deliveryAddress = "123 Main St, Balungao, Pangasinan";
      const status = paymentOption === "Cash on Delivery" ? "Pending" : "Paid";

      await addDoc(collection(db, "sales"), {
        type: "one-time", // Add the type field here
        productName: product.name,
        quantity,
        totalPrice,
        paymentOption,
        status,
        deliveryAddress,
        userId: user?.uid || "anonymous",
        timestamp: new Date(),
      });

      alert("Purchase successful!");
      onClose();
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("An error occurred while processing your purchase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Purchase {product.name}</h2>
      <form onSubmit={handleSubmit}>
        <p className="mb-2">
          <strong>Product:</strong> {product.name}
        </p>
        <p className="mb-2">
          <strong>Total Price:</strong> ₱{totalPrice.toFixed(2)}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Payment Option:</label>
          <select
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BuyForm;
