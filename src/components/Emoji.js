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
  const emojiAnimate = "motion-safe:animate-bounce";
  const textAnimate = "animate-bounce";
  const [textBubble, setTextBubble] = useState(false);
  const [emojiMove, setEmojiMove] = useState(false);
  const [textMove, setTextMove] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const txtEmoji = replyData.replyEmoji.map((emoji) => mapEmoji[emoji]).join("");

  const handleMouseEnter = () => {
    if (replyData.justUpdated) {
      replyData.justUpdated = false;
    }
    setTextBubble(true);
    setEmojiMove(true);
    setTextMove(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTextBubble(false);
    setEmojiMove(false);
    setTextMove(false);
    setIsHovered(false);
  };

  useEffect(() => {
    if (replyData.justUpdated) {
      setTextBubble(true);
      setEmojiMove(true);
      setTextMove(true);
    }

    const timeout = setTimeout(() => {
      setEmojiMove(false);
      setTextMove(false);

      // Generate a random time between 0 and 10 seconds
      const randomTime = Math.floor(Math.random() * (30000));

      // Start the animation again after the random time
      setTimeout(() => {
        setEmojiMove(true);
        setTextMove(true);
      }, randomTime);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [replyData.justUpdated]);

  return (
    <div className="relative mb-4">
      <div
        className="absolute -top-2 w-full h-full z-30"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div
        className={`text-6xl ${emojiMove ? emojiAnimate : ""}`}
        key={replyData.replyId}
      >
        {txtEmoji}
      </div>

      {textBubble && (
        <div
          className={`absolute flex flex-row justify-center -top-20 w-[100px] h-[100px] ${
            textMove ? textAnimate : ""
          }`}
        >
          <div className="relative flex-shrink flex flex-col">
            <div className="relative flex-shrink">
              <img
                className="absolute w-full h-full"
                src="assets/text_bubble.png"
                alt="Text Bubble"
              />
              <div className="flex justify-center min-w-[80px]">
                <span className="text-center text-xs mt-5 mb-10 ml-2 mr-2 z-30">
                  {replyData.replyTxt}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emoji;




/*
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
  const emojiAnimate = " motion-safe:animate-bounce";
  const textAnimate = " animate-bounce";
  const [textBubble, setTextBubble] = useState(false);
  const [emojiMove, setEmojiMove] = useState(false);
  const [textMove, setTextMove] = useState(false);
  const txtEmoji = replyData.replyEmoji.map((emoji) => mapEmoji[emoji]).join("");

  const handleMouseEnter = () => {
    // if ever hovered, end justUpdated status!
    if(replyData.justUpdated){
      replyData.justUpdated=false;
    }
    setTextBubble(true);
    setEmojiMove(true);
    setTextMove(true);
  };

  const handleMouseLeave = () => {
    setTextBubble(false);
    setEmojiMove(false);
    setTextMove(false);
  };

  useEffect(() => {
    if (replyData.justUpdated) {
      setTextBubble(true);
      setEmojiMove(true);
      setTextMove(true);
    }
  }, [replyData.justUpdated]);

  return (
    <div className="relative mb-4">
      <div 
        className="absolute -top-2 w-full h-full z-30"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>
      <div 
        className= {"text-6xl"+(emojiMove?emojiAnimate:"")}
        key={replyData.replyId}
      >
        {txtEmoji}
      </div>

      {textBubble && (
        <div className={"absolute flex flex-row justify-center -top-20 w-[100px] h-[100px]"+(textMove?textAnimate:"")}>
          <div className="relative flex-shrink flex flex-col">
            <div className="relative flex-shrink">

              <img
                className="absolute w-full h-full"
                src="assets/text_bubble.png"
                alt="Text Bubble"
              />

              <div className="flex justify-center min-w-[80px]">
                <span className="text-center text-xs mt-5 mb-10 ml-2 mr-2 z-30">
                  {replyData.replyTxt}
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emoji;
*/