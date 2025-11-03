import React from 'react';
import { FaCog, FaCode, FaPlay } from 'react-icons/fa';

const Navbar = ({ toggleSettingsPanel, toggleCodePanel, toggleLiveView }) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 text-white p-4 shadow-lg">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">BotForge</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* New "Live" button */}
        <button
          onClick={toggleLiveView}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <FaPlay />
          <span>Live</span>
        </button>
        {/* Existing buttons */}
        <button
          onClick={toggleSettingsPanel}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <FaCog />
          <span>Node Settings</span>
        </button>
        <button
          onClick={toggleCodePanel}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          <FaCode />
          <span>Generated Code</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;