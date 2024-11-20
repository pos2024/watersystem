// In your DeliveryCompleteDetails.js file
import React from 'react';
import { formatDate } from './utils'; // Adjust the import path based on your folder structure

const DeliveryCompleteDetails = ({ user }) => {
    // Calculate the total gallons based on the user's subscription
    const totalGallons = user.subscription_details?.gallons_per_week * user.delivery_schedule.length;
  
    // Calculate the remaining gallons by counting the pending deliveries
    const remainingGallons = user.delivery_status.filter(status => status === "Pending").length * user.subscription_details?.gallons_per_week;
  
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">User Details: {user.personal_details?.name}</h2>
  
        <p><strong>Subscription:</strong> {user.subscription_details?.subscription_name}</p>
        <p><strong>Address:</strong> {user.personal_details?.address}</p>
        <p><strong>Email:</strong> {user.personal_details?.email}</p>
        <p><strong>Phone Number:</strong> {user.personal_details?.phone_number}</p>
  
        <h3 className="text-xl font-semibold mt-4">Delivery Schedule</h3>
        <ul>
          {user.delivery_schedule && user.delivery_schedule.map((date, index) => (
            <li key={index} className="flex justify-between">
              <span>{formatDate(date)}</span>
              {user.delivery_status[index] === "Delivered" ? (
                <span className="text-green-500">Delivered</span>
              ) : (
                <span className="text-orange-500">Pending</span>
              )}
            </li>
          ))}
        </ul>
  
        <h3 className="text-xl font-semibold mt-4">Delivery Summary</h3>
        <p><strong>Total Gallons to be Delivered:</strong> {totalGallons} gallons</p>
        <p><strong>Remaining Gallons:</strong> {remainingGallons} gallons</p>
      </div>
    );
  };
  
  export default DeliveryCompleteDetails;