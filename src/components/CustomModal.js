import React from 'react';
import Modal from 'react-modal'; // Importing Modal from 'react-modal'
import '../pages/modal.css';

const CustomModal = ({ isOpen, closeModal, children }) => {
  return (
    <Modal
      isOpen={isOpen} // controls if the modal is open
      onRequestClose={closeModal} // closes when clicking outside the modal or pressing ESC
      contentLabel="Custom Modal"
      className="modal-content" // Matches CSS class for content animation
      overlayClassName="modal-overlay" // Matches CSS class for overlay animation
      closeTimeoutMS={200} // Optional: adds smooth fade-out when closing the modal
    >
      <div className="relative p-4 bg-white rounded-md shadow-lg">
        <button
          onClick={closeModal}
          className="text-red-500 hover:text-red-700 absolute top-2 right-2"
        >
          X
        </button>
        {children} {/* Render any content passed into the modal */}
      </div>
    </Modal>
  );
};

export default CustomModal;
