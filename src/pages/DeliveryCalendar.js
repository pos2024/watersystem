import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { collection, getDocs } from 'firebase/firestore';
import db from '../firebase';
import CustomModal from '../components/CustomModal'; // Custom Modal for viewing delivery details
import AllListName from './AllListName'; // Component to render the list of deliveries

const DeliveryCalendar = () => {
  const [deliverySchedules, setDeliverySchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [modalContent, setModalContent] = useState([]); // Content for the modal (delivery details)

  const localizer = momentLocalizer(moment);

  // Fetch user deliveries from Firebase on component mount
  useEffect(() => {
    const fetchUserDeliveries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const schedules = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.delivery_schedule && Array.isArray(userData.delivery_schedule)) {
            const statuses = userData.delivery_status || [];
            const subscriptionDetails = userData.subscription_details || {}; // Get subscription details
            const gallonsPerWeek = subscriptionDetails.gallons_per_week || 'Not Available'; // Default if not available

            // Loop over the delivery schedule and create schedule objects
            userData.delivery_schedule.forEach((date, index) => {
              const isDelivered = statuses[index] === 'Delivered';

              // Safeguard against undefined properties
              const userName = userData.personal_details?.name || 'Unknown Name';
              const address = userData.personal_details?.address || 'Unknown Address';

              // Create an event object with gallons_per_week
              schedules.push({
                title: `${userName} - Delivery`,
                start: new Date(date),
                end: new Date(date),
                allDay: true,
                status: isDelivered ? 'Delivered' : 'Pending',
                userName,
                address,
                date,
                gallonsPerWeek, // Add gallons_per_week to the schedule
              });
            });
          }
        });

        setDeliverySchedules(schedules);
      } catch (error) {
        setError('Error fetching delivery schedules');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDeliveries();
  }, []); // Runs only once on component mount

  // Handle opening the modal for specific day's events
  const handleModalOpen = (eventsForDay) => {
    setModalContent(eventsForDay); // Set the content for the modal (delivery details)
    setIsModalOpen(true); // Open the modal
  };

  // Close the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent([]); // Reset the modal content when closed
  };

  // Group the events by date
  const groupedEvents = deliverySchedules.reduce((acc, event) => {
    const dateStr = event.start.toISOString().split('T')[0]; // Group by date (YYYY-MM-DD)
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {});

  // Format the grouped events for the calendar
  const calendarEvents = Object.keys(groupedEvents).map((dateStr) => {
    const eventsForDay = groupedEvents[dateStr];
    return {
      title: eventsForDay.length > 1 ? 'View Details' : 'Delivery', // Display "View Details" if more than 1 delivery on that date
      start: new Date(dateStr),
      end: new Date(dateStr),
      allDay: true,
      events: eventsForDay,
    };
  });

  // Custom event styling (Green for Delivered, Red for Pending)
  const eventStyleGetter = (event) => {
    const textColor = event.events[0].status === 'Delivered' ? '#28a745' : '#ff6347'; // Green for Delivered, Orange for Pending
    return {
      style: {
        color: textColor, // Set text color instead of background color
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '5px',
      },
    };
  };

  // Custom event rendering (for displaying additional info and opening modal)
  const customEvent = ({ event }) => {
    return (
      <div className="event-tooltip">
        {event.events.length > 1 && (
          <button
            onClick={() => handleModalOpen(event.events)}
            className="text-blue-500 mt-2 underline"
          >
            Check Deliveries
          </button>
        )}
      </div>
    );
  };

  // Loading and error states
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Delivery Calendar</h1>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 600,
            border: 'none',
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          views={['month', 'week', 'day']}
          toolbar
          popup
          eventPropGetter={eventStyleGetter}
          components={{
            event: customEvent, // Custom event renderer for displaying event details
          }}
        />
      </div>

      {/* Modal for Viewing All Details */}
      <CustomModal isOpen={isModalOpen} closeModal={handleModalClose}>
        <h2 className="text-xl font-semibold mb-4">
          Delivery Details for {modalContent[0]?.date || "No deliveries"}
        </h2>
        {modalContent.length > 0 ? (
          <AllListName deliveries={modalContent} /> // Display list of deliveries in the modal
        ) : (
          <p>No deliveries for this date.</p>
        )}
      </CustomModal>
    </div>
  );
};

export default DeliveryCalendar;
