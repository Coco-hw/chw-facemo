import React from 'react';

// "OK"btn onclick -> activate onCameraClick
const Camera = ({ onCameraClick }) => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-200 h-full">
      <div>
        
        {/* content */}
        <span role="img" aria-label="Camera">
          📷
        </span>

        {/* button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={onCameraClick}
        >
          OK
        </button>

      </div>
    </div>
  );
};

export default Camera;