import React, { useEffect } from 'react';
import Modal from 'react-modal';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS file

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '1000px',
    maxHeight: '80%',
    overflow: 'auto',
    border: 'none',
    borderRadius: '8px',
    // boxShadow: '0px 0px 20px 0px rgba(98, 50, 136, .9)',
    padding: '0',
    background: 'transparent'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: '1000', 
    backdropFilter: 'blur(6px)'
  },
};

const CustomModal2 = ({ isOpen, onRequestClose, children }) => {
  useEffect(() => {
    AOS.init();
  }, []); // Initialize AOS only once when component mounts

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }

    return () => {
      document.body.style.overflow = 'auto'; // Restore original overflow style when component unmounts
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Custom Modal"
    >
      {children}
    </Modal>
  );
};

export default CustomModal2;
