import React, { useEffect, useState } from 'react';

const Emoji = ({replyData}) => {
  const justUpdatedClassName = "h-50 text-6xl animate-bounce"
  const notUpdatedClassName = "h-50 text-6xl"
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    console.log("hovered");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    console.log(isHovered); 
  });

  const messageBoxStyle = {
    display: isHovered ? 'block' : 'none',
    position: 'absolute',
    top: '100%', // Position the messageBox below the Emoji component
    left: '50%', // Center the messageBox horizontally
    transform: 'translateX(-50%)', // Adjust horizontal centering
    width: '200px',
    padding: '10px',
    background: '#FFFFFF',
    border: '1px solid #000000',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: '9999',
  };

  return(
    <div
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      <div 
      className={replyData.justUpdated?justUpdatedClassName:notUpdatedClassName}
      key={replyData.replyId}
      >
        {replyData.replyEmoji}
      </div>
      {isHovered && (
        <div style={messageBoxStyle}>
          <p>Here!</p>
        </div>
      )}
    </div>
  );
}
export default Emoji;