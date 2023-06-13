const mapEmoji = {
  angry: "😡",
  disgusted: "🤢",
  fearful: "😨",
  happy: "😊",
  neutral: "😐",
  sad: "😥",
  surprised: "😲",
};
import {Button, Typography } from "@material-tailwind/react"

const Thumbnail = ({ content, emojiCount, openModal, setCurrentContentId }) => {
  const { contentId, contentSrc } = content;

  const handleClick = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    setCurrentContentId(contentId);
    openModal();
  };

  return (
    <button className="relative w-30 h-30 overflow-hidden" onClick={handleClick}>
      <img
        src={contentSrc}
        alt={`Content ${contentId}`}
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
      {/* hover  */}
      <div className="absolute flex justify-center items-center inset-0 bg-black opacity-0 hover:opacity-70 transition-opacity duration-100">
        <div className="text-white">
          <Typography variant="paragraph" color="white">
            {Object.keys(emojiCount).map((emoji)=>{
              if(emojiCount[emoji]){
                return(<div>{`${mapEmoji[emoji]} ${emojiCount[emoji]}`}</div>);
              }
            })}
            {Object.values(emojiCount).every((value) => value===0) && <div>no emojis yet</div>}
          </Typography>
        </div>
      </div>
    </button>
  );
};

export default Thumbnail;
