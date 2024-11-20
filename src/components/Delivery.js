import React, { useState, useEffect } from "react";
import db from "../firebase"; // Your Firestore initialization
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import Modal from "react-modal"; // Importing Modal from 'react-modal'
import CustomModal from "./CustomModal"; // Import your custom modal component
import DeliveryCompleteDetails from "./DeliveryCompleteDetails"; // Import the modal details component
import Logout from "./Logout"
import ManageOrder from "./ManageOrder";

// Format the date as 'Nov 19, 2024' or 'November 19, 2024'
const formatDate = (date) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",  // For abbreviated month like "Nov"
    day: "numeric"
  });
};

const Delivery = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user data

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const activeSubscriptionQuery = query(usersCollection, where("subscription_status", "==", "active"));
        const usersSnapshot = await getDocs(activeSubscriptionQuery);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserList(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user); // Set the selected user for the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedUser(null); // Clear selected user
  };

  // Function to format delivery schedule with color and limit to 4 items
  const formatDeliverySchedule = (schedule, deliveryStatus) => {
    const maxDisplay = 4; // Limit to 4 dates
    const displaySchedule = schedule.slice(0, maxDisplay);
    const displayStatus = deliveryStatus.slice(0, maxDisplay);

    return displaySchedule.map((date, index) => {
      const formattedDate = formatDate(date);
      const status = displayStatus[index];

      // Apply color based on status
      const colorClass = status === "Delivered" ? "text-green-500" : status === "Pending" ? "text-orange-500" : "text-gray-500";

      return (
        <span key={index} className={colorClass}>
          {formattedDate}
          {index < displaySchedule.length - 1 && ", "}
        </span>
      );
    }).concat(schedule.length > maxDisplay ? [<span key="more">... More</span>] : []);
  };

  // Function to get the next delivery date
  const getNextDeliveryDate = (deliverySchedule, deliveryStatus) => {
    for (let i = 0; i < deliverySchedule.length; i++) {
      if (deliveryStatus[i] !== "Delivered") {
        return formatDate(deliverySchedule[i]);
      }
    }
    return null; // Return null if all deliveries are marked as delivered
  };

  // Handle marking a delivery as delivered
  const handleMarkAsDelivered = async (userIndex, dateIndex) => {
    const newUserList = [...userList];
    const user = newUserList[userIndex];
    const userDocRef = doc(db, "users", user.id);

    // Update delivery status for the specific delivery date
    const updatedDeliveryStatus = [...user.delivery_status];
    updatedDeliveryStatus[dateIndex] = "Delivered"; // Mark as delivered

    try {
      await updateDoc(userDocRef, {
        delivery_status: updatedDeliveryStatus
      });

      // Update the state to reflect the change
      setUserList(newUserList);
      console.log(`Delivery for ${user.personal_details?.name} marked as delivered.`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-delivery px-4 py-6 max-w-8xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-center">Admin Delivery Dashboard</h3>

      <table className="min-w-full bg-white shadow-md rounded-md">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Subscription</th>
            <th className="py-3 px-4 text-left">Address</th>
            <th className="py-3 px-4 text-left">Delivery Schedule</th>
            <th className="py-3 px-4 text-left">Next Delivery</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, userIndex) => (
            <tr key={user.id} className="border-b">
              <td className="py-3 px-4">{user.personal_details?.name}</td>
              <td className="py-3 px-4">{user.subscription_details?.subscription_name}</td>
              <td className="py-3 px-4">{user.personal_details?.address}</td>
              <td className="py-3 px-4">
                {user.delivery_schedule ? formatDeliverySchedule(user.delivery_schedule, user.delivery_status) : 'N/A'}
              </td>
              <td className="py-3 px-4">
                {getNextDeliveryDate(user.delivery_schedule, user.delivery_status) ? (
                  <span>
                    {getNextDeliveryDate(user.delivery_schedule, user.delivery_status)}
                  </span>
                ) : (
                  <span className="text-green-500">All Delivered</span>
                )}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleViewDetails(user)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 mr-2"
                >
                  View
                </button>
                <button
                  onClick={() => handleMarkAsDelivered(userIndex, user.delivery_status.findIndex(status => status === "Pending"))}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                >
                  Delivered
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for viewing user details */}
      <CustomModal isOpen={isModalOpen} closeModal={handleCloseModal}>
        {selectedUser && <DeliveryCompleteDetails user={selectedUser} />}
      </CustomModal>
      <ManageOrder/>

      <Logout/>
    </div>
  );
};

export default Delivery;
