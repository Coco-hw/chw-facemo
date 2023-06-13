import React, { useState, useEffect, useRef, Fragment } from "react";
import Bundle from "@/components/Bundle";
import Emoji from "@/components/Emoji";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/solid";

// return hovering canvas with content image, camera, replyList
const Modal = ({
  contentList,
  replyList,
  currentAccountId,
  currentContentId,
  closeModal,
  uploadReply,
  videoRef,
  stopWebcam,
}) => {
  // find current content from contentList which matches currentContentId // contentList = [{contentId, contentSrc}, ... ]
  const currentContent = contentList.find(
    (item) =>
      item.accountId === currentAccountId && item.contentId === currentContentId
  );
  // find current replyList from replyList which matches currentContentId // replyList = [ {contentId, replyId, replyEmoji, replyTxt, timestamp}, ... ]
  const [currentReplyList, setCurrentReplyList] = useState([]);

  // emoji를 저장할 useState, useRef 선언
  const [currentEmoji, setCurrentEmoji] = useState([]);
  const setCurrentEmojiRef = useRef();
  setCurrentEmojiRef.current = setCurrentEmoji;

  // replyTxt를 저장할 useState 선언
  const [inputTxt, setInputTxt] = useState("");

  // temporary text
  const [sampleTxt, setSampleTxt] = useState("happy~");
  const setSampleTxtRef = useRef();
  setSampleTxtRef.current = setSampleTxt;

  // save and upload reply (in index)
  const saveReply = () => {
    // { contentId, replyId, replyEmoji, replyTxt, timestamp }
    uploadReply({
      accountId: currentAccountId,
      contentId: currentContentId,
      replyId: replyList.length,
      replyEmoji: currentEmoji,
      replyTxt: inputTxt ? inputTxt : sampleTxt,
      timestamp: Date.now(),
    });
    console.log(currentEmoji);
    setInputTxt("");
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
        replyList.filter(
          (item) =>
            item.accountId === currentAccountId &&
            item.contentId === currentContentId
        )
      );
    }
  }, [replyList]);

  // Render
  return (
    <Fragment>
    <div className="absolute top-0 left-0 w-full h-screen bg-black opacity-60"></div>

    <div 
      className="absolute top-0 left-0 w-full h-screen flex items-center justify-center"
      onClick={closeBundleModal}
    >
      {/* container */}
      <div
        className="relative bg-white flex w-2/3 h-3/4"
        onClick={(e) => {e.stopPropagation()}}
      >
        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 z-30"
          onClick={closeBundleModal}
        >
          <XMarkIcon strokeWidth={2} className="h-10 w-10"></XMarkIcon>
        </button>

        {/* contentSrc(image) */}
        <div className="relative basis-1/2">
          <img
            src={currentContent.contentSrc}
            alt={`Content ${currentContentId}`}
            style={{ width: "600px", height: "100%", objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <Typography variant="paragraph" color="white">
                {currentContent.contentTxt}
              </Typography>
            </div>
          </div>
        </div>

        {/* Bundle or emojiList */}
        {bundleOpened ? (
          <div className="relative basis-1/2">
            <Button
              className="absolute top-3 left-2 z-30"
              color="indigo"
              size="sm"
              onClick={closeBundle}
            >
              show emoji list
            </Button>
            <div className="h-full flex justify-center items-center">
              <Bundle
                closeBundle={closeBundle}
                setCurrentEmojiRef={setCurrentEmojiRef}
                currentEmoji={currentEmoji}
                saveReply={saveReply}
                inputTxt={inputTxt}
                sampleTxt={sampleTxt}
                setSampleTxtRef={setSampleTxtRef}
                setInputTxt={setInputTxt}
                intervalRef={intervalRef}
                stopInterval={stopInterval}
                videoRef={videoRef}
              />
            </div>
          </div>
        ) : (
          <div className="relative basis-1/2 flex flex-col bg-gray-200">
            {/* emoji list */}
            <div className="h-full overflow-visible overflow-auto hide-scrollbar">
              <div className="flex flex-wrap justify-start pt-10 ps-5">
                {currentReplyList.map((replyData) => (
                  <Emoji replyData={replyData} />
                ))}
              </div>
            </div>

            {/* retake pic button */}
            <div className="w-full flex justify-center">
              <Button
                className="flex justify-center items-center p-4 mt-10"
                color="white"
                onClick={openBundle}
                rounded={true}
              >
                <CameraIcon strokeWidth={1} className="h-10 w-10"></CameraIcon>
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* end of container */}
    </div>
    </Fragment>
  );
};

export default Modal;
