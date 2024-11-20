import React from 'react';

const AllListName = ({ deliveries }) => {
  if (!deliveries || deliveries.length === 0) {
    return <p>No deliveries available for this date.</p>;
  }

  return (
    <div>
      <ul>
        {deliveries.map((delivery, index) => (
          <li key={index} className="mb-2 p-2 border-b">
            <div className="font-bold">{delivery.userName || 'Unknown Name'}</div>
            <div className="text-sm">{delivery.address || 'Unknown Address'}</div>
            <div className="text-sm">Gallons: {delivery.gallonsPerWeek || 'Not Available'}</div>
            <div className={`text-sm ${delivery.status === 'Delivered' ? 'text-green-500' : 'text-red-500'}`}>
              Status: {delivery.status}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllListName;
