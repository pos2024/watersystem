import React, { useState, useEffect } from "react";
import  db  from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BuyForm from "./BuyForm";
import CustomModal from "./CustomModal";

const Buy = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product for modal
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded shadow-sm flex flex-col items-center"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-32 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">Price: ₱{product.price.toFixed(2)}</p>
            <button
              onClick={() => openModal(product)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Purchase
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Purchase Form */}
      <CustomModal isOpen={isModalOpen} closeModal={closeModal}>
        {selectedProduct ? (
          <BuyForm product={selectedProduct} onClose={closeModal} />
        ) : (
          <p>Loading...</p>
        )}
      </CustomModal>
    </div>
  );
};

export default Buy;
