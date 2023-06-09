import React, { useState, useEffect, useRef } from "react";
import Bundle from "@/components/Bundle";
import Emoji from "@/components/Emoji";
import { Button } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

// return hovering canvas with content image, camera, replyList
const Modal = ({
  contentList,
  replyList,
  currentContentId,
  closeModal,
  uploadReply,
  videoRef,
  stopWebcam,
}) => {
  // find current content from contentList which matches currentContentId // contentList = [{contentId, contentSrc}, ... ]
  const currentContent = contentList.find(
    (item) => item.contentId === currentContentId
  );
  // find current replyList from replyList which matches currentContentId // replyList = [ {contentId, replyId, replyEmoji, replyTxt, timestamp}, ... ]
  const [currentReplyList, setCurrentReplyList] = useState([]);

  // emoji를 저장할 useState, useRef 선언
  const [currentEmoji, setCurrentEmoji] = useState("");
  const setCurrentEmojiRef = useRef();
  setCurrentEmojiRef.current = setCurrentEmoji;

  // save and upload reply (in index)
  const saveReply = () => {
    // { contentId, replyId, replyEmoji, replyTxt, timestamp }
    uploadReply({
      contentId: currentContentId,
      replyId: replyList.length,
      replyEmoji: currentEmoji,
      replyTxt: "",
      timestamp: Date.now(),
    });
    console.log(currentEmoji);
  };

  // 외부에서 접근 가능한 interval reference 저장
  const intervalRef = useRef(null);
  // intervalRef에 할당된 interval을 멈추는 함수
  const stopInterval = async () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  // bundle의 상태를 저장하는 변수입니다.
  const [bundleOpened, setBundleOpened] = useState(true);
  // bundle을 열고 닫는 함수입니다.
  const openBundle = async () => {
    setBundleOpened(true);
  };
  const closeBundle = async () => {
    // await stopInterval();
    await stopWebcam();
    setBundleOpened(false);
  };

  const closeBundleModal = async () => {
    await closeBundle();
    closeModal();
  };

  // update replyList when first rendered & replyList updated
  useEffect(() => {
    if (replyList) {
      setCurrentReplyList(
        replyList.filter((item) => item.contentId === currentContentId)
      );
    }
  }, [replyList]);

  // Render
  return (
    <div className="fixed inset-0 flex justify-center items-center z-10 pt-8">
      <div className="relative bg-transparent w-4/5">
        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={closeBundleModal}
        >
          <XMarkIcon strokeWidth={2} className="h-10 w-10"></XMarkIcon>
        </button>

        {/* image and {Bundle or replyList} box */}
        <div className="flex flex-row">
          {/* contentSrc(image) */}
          <div className="">
            <img
              src={currentContent.contentSrc}
              alt={`Content ${currentContentId}`}
              style={{ width: "600px", height: "600px", objectFit: "cover" }}
            />
          </div>

          {/* Bundle or emojiList */}
          {bundleOpened ? (
            <div className="basis-1/2">
              <div className="h-full flex justify-center items-center">
                <Bundle
                  closeBundle={closeBundle}
                  setCurrentEmojiRef={setCurrentEmojiRef}
                  saveReply={saveReply}
                  intervalRef={intervalRef}
                  stopInterval={stopInterval}
                  videoRef={videoRef}
                />
              </div>
            </div>
          ) : (
            <div className="basis-1/2 bg-gray-200">
              {/* emoji list */}
              <div className="flex flex-wrap">
                {currentReplyList.map((replyData) => (
                  <Emoji replyData={replyData} />
                ))}
              </div>

              {/* retake pic button */}
              <Button
                variant="filled"
                size="lg"
                color="white"
                onClick={openBundle}
              >
                retake picture
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
