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
  const txtEmoji = replyData.replyEmoji.map(emoji => mapEmoji[emoji]).join("");

  return (
    <Tooltip
      content={replyData.replyTxt}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
    >
      <div
        className={ replyData.justUpdated ? justUpdatedClassName : notUpdatedClassName }
        key={replyData.replyId}
      >
        {txtEmoji}
      </div>
    </Tooltip>
  );
};
export default Emoji;
