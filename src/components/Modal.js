import React, { useState, useEffect, useRef } from "react";
import Bundle from "@/components/Bundle";
import Emoji from "@/components/Emoji";
import { Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

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
      contentId: currentContentId,
      replyId: replyList.length,
      replyEmoji: currentEmoji,
      replyTxt: inputTxt?inputTxt:sampleTxt,
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
        replyList.filter((item) => item.contentId === currentContentId)
      );
    }
  }, [replyList]);

  // Render
  return (
    <div className="fixed inset-0 flex justify-center items-center pt-8">
      {/* 화면 밖 누르면 모달 꺼지게 구현하고 싶었으나 실패. 부모요소에 onClick 두면 모달 안쪽 눌러도 꺼짐. */}
      {/* <div className="z-10 h-screen" onClick={closeBundleModal}></div> */}
      <div className="relative bg-transparent w-4/5 z-20">
        {/* close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 z-20"
          onClick={closeBundleModal}
        >
          <XMarkIcon strokeWidth={2} className="h-10 w-10"></XMarkIcon>
        </button>

        {/* image and {Bundle or replyList} box */}
        <div className="flex flex-row">
          {/* contentSrc(image) */}
          <div className="relative">
            <div>
              <img
                src={currentContent.contentSrc}
                alt={`Content ${currentContentId}`}
                style={{ width: "600px", height: "600px", objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <Typography variant="paragraph" color="white">
                    {currentContent.contentTxt}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Bundle or emojiList */}
          {bundleOpened ? (
            <div className="basis-1/2">
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
            <div className="basis-1/2 bg-gray-200">
              {/* emoji list */}
              <div className="flex flex-wrap">
                {currentReplyList.map((replyData) => (
                  <Emoji replyData={replyData} />
                ))}
              </div>

              {/* retake pic button */}
              <Button
                className="sticky inset-y-0"
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
