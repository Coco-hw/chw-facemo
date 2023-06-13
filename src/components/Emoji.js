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
  const justUpdatedClassName = "relative text-6xl animate-bounce z-30";
  const notUpdatedClassName = "relative text-6xl";
  const [isHovered, setIsHovered] = useState(false);
  const [textBubble, setTextBubble] = useState(false);
  const txtEmoji = replyData.replyEmoji.map((emoji) => mapEmoji[emoji]).join("");

  useEffect(() => {
    console.log(txtEmoji);
    console.log(replyData.replyEmoji);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTextBubble(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!replyData.justUpdated) {
      setTextBubble(false);
    }
  };

  useEffect(() => {
    console.log(isHovered);
  });

  useEffect(() => {
    if (replyData.justUpdated) {
      setTextBubble(true);
    }
  }, [replyData.justUpdated]);

  return (
    <div
      className={
        replyData.justUpdated ? justUpdatedClassName : notUpdatedClassName
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div key={replyData.replyId}>{txtEmoji}</div>
      {textBubble && (
        <div className="absolute -top-20 w-[100px] h-[100px] z-30">
          <img
            className="w-full h-full"
            src="assets/text_bubble.png"
            alt="Text Bubble"
          />
          <div className="w-full h-full text-xs">
            {replyData.replyTxt}
          </div>
        </div>
      )}
    </div>
  );
};

export default Emoji;
