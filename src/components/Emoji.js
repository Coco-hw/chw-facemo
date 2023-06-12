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
  const justUpdatedClassName = "text-6xl animate-bounce z-20";
  const notUpdatedClassName = "text-6xl";
  const [isHovered, setIsHovered] = useState(false);
  const txtEmoji = replyData.replyEmoji
    .map((emoji) => mapEmoji[emoji])
    .join("");

  useEffect(() => {
    console.log(txtEmoji);
    console.log(replyData.replyEmoji);
  }, []);

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
    <div
      className={
        replyData.justUpdated ? justUpdatedClassName : notUpdatedClassName
      }
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
        <div key={replyData.replyId}>{txtEmoji}</div>
      </Tooltip>
    </div>
  );
};
export default Emoji;
