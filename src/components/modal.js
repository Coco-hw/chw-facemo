import React, { useState, useEffect, useRef } from "react";
import Bundle from "@/components/Bundle";
import Emoji from "@/components/Emoji";

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

  // replyTxt를 저장할 useState 선언
  const [inputTxt, setInputTxt] = useState("");

  // save and upload reply (in index)
  const saveReply = () => {
    // { contentId, replyId, replyEmoji, replyTxt, timestamp }
    uploadReply({
      contentId: currentContentId,
      replyId: replyList.length,
      replyEmoji: currentEmoji,
      replyTxt: inputTxt,
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
    setInputTxt("");
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
      <div className="relative w-2/3 bg-white rounded-lg p-4">
        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={closeBundleModal}
        >
          X
        </button>

        {/* image and {Bundle or replyList} box */}
        <div className="flex">
          {/* contentSrc(image) */}
          <div className="w-2/3">
            <img
              src={currentContent.contentSrc}
              alt={`Content ${currentContentId}`}
              style={{ width: "500px", height: "700px", objectFit: "cover" }}
            />
          </div>

          {/* Bundle or emojiList */}
          {bundleOpened ? (
            <div>
              <div className="h-full flex justify-center items-center">
                <Bundle
                closeBundle={closeBundle}
                setCurrentEmojiRef={setCurrentEmojiRef}
                saveReply={saveReply}
                inputTxt={inputTxt}
                setInputTxt={setInputTxt}
                intervalRef={intervalRef}
                stopInterval={stopInterval}
                videoRef={videoRef}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-200">
              {/* emoji list */}

              {currentReplyList.map((replyData) => (
                <Emoji replyData={replyData} />
              ))}

              {/* retake pic button */}
              <button
                className="bg-blue-500 text-white px-2 rounded mt-4"
                onClick={openBundle}
              >
                retake picture
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
