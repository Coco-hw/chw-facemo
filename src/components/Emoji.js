import React, { useEffect, useState } from "react";
import { Tooltip, Button } from "@material-tailwind/react";

// emotion을 emoji로 변환할 오브젝트 mapEmoji 설정
const mapEmoji = {
  angry: "😡",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "😥",
  surprised: "😲",
};

const Emoji = ({ replyData }) => {
  const justUpdatedClassName = "h-50 text-6xl animate-bounce";
  const notUpdatedClassName = "h-50 text-6xl";
  const [isHovered, setIsHovered] = useState(false);
  const txtEmoji = replyData.replyEmoji.map(emoji => mapEmoji[emoji]).join("");

  useEffect(() => {
    console.log(txtEmoji);
    console.log(replyData.replyEmoji);
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true);
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
          content={replyData.replyTxt}
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
            {txtEmoji}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};
export default Emoji;
