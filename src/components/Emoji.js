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

  return (
    <div>
      <div
        className="flex flex-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
