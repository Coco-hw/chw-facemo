import React, { useEffect, useState } from "react";
import { Tooltip, Button } from "@material-tailwind/react";

const Emoji = ({ replyData }) => {
  const justUpdatedClassName = "h-50 text-6xl animate-bounce";
  const notUpdatedClassName = "h-50 text-6xl";
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
    display: isHovered ? "block" : "none",
    position: "absolute",
    top: "50%", // Position the messageBox below the Emoji component
    left: "50%", // Center the messageBox horizontally
    transform: "translateX(-50%)", // Adjust horizontal centering
    width: "200px",
    padding: "10px",
    background: "#FFFFFF",
    border: "1px solid #000000",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    zIndex: "9999",
  };

  return (
    <div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Tooltip
          content="Material Tailwind"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <div
            className={
              replyData.justUpdated ? justUpdatedClassName : notUpdatedClassName
            }
            key={replyData.replyId}
          >
            {replyData.replyEmoji}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export default Emoji;
