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
  const bounce = " motion-safe:animate-bounce";
  const [textBubble, setTextBubble] = useState(false);
  const txtEmoji = replyData.replyEmoji.map((emoji) => mapEmoji[emoji]).join("");

  useEffect(() => {
    console.log(txtEmoji);
    console.log(replyData.replyEmoji);
  }, []);

  const handleMouseEnter = () => {
    // if ever hovered, end justUpdated status!
    if(replyData.justUpdated){
      replyData.justUpdated=false;
    }
    setTextBubble(true);
  };

  const handleMouseLeave = () => {
    setTextBubble(false);
  };

  useEffect(() => {
    if (replyData.justUpdated) {
      setTextBubble(true);
    }
  }, [replyData.justUpdated]);

  return (
    <div 
      className="relative m-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className= {"text-6xl"+(textBubble?bounce:"")}
        key={replyData.replyId}
      >
        {txtEmoji}
      </div>

      {textBubble && (
        <div className={"absolute -top-20 w-[100px] h-[80px]"+(textBubble?bounce:"")}>
          <div className="relative w-full h-full">

            <img
              className="absolute w-full h-full"
              src="assets/text_bubble.png"
              alt="Text Bubble"
            />

            <div className="relative flex flex-col justify-center w-full h-2/3">
              <span className="absolute w-full text-center text-xs">
                {replyData.replyTxt}
              </span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Emoji;
