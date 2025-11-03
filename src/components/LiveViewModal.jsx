// components/LiveViewModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Live from './Live'; 

/**
 * A modal component to display the live Telegram web page
 * inside a phone screen frame.
 * @param {Object} props
 * @param {Function} props.onClose - Function to close the modal.
 */
const LiveViewModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-lg h-[80vh] flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold">Live Preview</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex-grow w-full overflow-hidden flex items-center justify-center">
          <Live />
        </div>
      </div>
    </div>
  );
};

export default LiveViewModal;