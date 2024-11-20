import React, { useState } from "react";
import  db  from "../firebase"; // Import Firestore instance
import { collection, addDoc } from "firebase/firestore"; // Import Firestore methods

const CreateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // New field for image URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !imageUrl) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const product = {
        name,
        price: parseFloat(price), // Ensure price is stored as a number
        imageUrl, // Save the image URL directly
        createdAt: new Date(), // Add a timestamp
      };

      // Add product to Firestore collection
      const productRef = collection(db, "products");
      await addDoc(productRef, product);

      alert("Product created successfully!");
      setName("");
      setPrice("");
      setImageUrl("");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
