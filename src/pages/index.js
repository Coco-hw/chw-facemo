const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Button, Avatar, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
///////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import Thumbnail from "@/components/Thumbnail";
import Modal from "@/components/Modal";
import Intro from "@/components/Intro";
// import P5Sketch from "@/components/P5Sketch";
import HomePage from "@/components/HomePage";
import { useRouter } from "next/router";

///////////////////////////////////////////////////////
// samples
const contentList = [
  // \
  {
    accountId: 1,
    contentId: 1,
    contentSrc: "assets/chw-image_1.jpg",
    contentTxt: "붉은머리오목눈이(뱁새): 갸웃?",
  },
  {
    accountId: 1,
    contentId: 2,
    contentSrc: "assets/chw-image_2.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 3,
    contentSrc: "assets/chw-image_3.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 4,
    contentSrc: "assets/chw-image_4.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 5,
    contentSrc: "assets/chw-image_5.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 6,
    contentSrc: "assets/chw-image_6.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 7,
    contentSrc: "assets/chw-image_7.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 8,
    contentSrc: "assets/chw-image_8.jpg",
    contentTxt: "",
  },
  {
    accountId: 1,
    contentId: 9,
    contentSrc: "assets/chw-image_9.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 1,
    contentSrc: "assets/a3image1.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 2,
    contentSrc: "assets/a3image2.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 3,
    contentSrc: "assets/a3image3.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 4,
    contentSrc: "assets/a3image4.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 5,
    contentSrc: "assets/a3image5.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 6,
    contentSrc: "assets/a3image6.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 7,
    contentSrc: "assets/a3image7.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 8,
    contentSrc: "assets/a3image8.jpg",
    contentTxt: "",
  },
  {
    accountId: 3,
    contentId: 9,
    contentSrc: "assets/a3image9.jpg",
    contentTxt: "",
  },
  {
    accountId: 2,
    contentId: 1,
    contentSrc: "assets/magnolia.jpg",
    contentTxt: "폴 토마스 앤더슨, <매그놀리아> (1999)",
  },
  {
    accountId: 2,
    contentId: 2,
    contentSrc: "assets/paprika.jpg",
    contentTxt: "콘 사토시, <파프리카>(2006)",
  },

  {
    accountId: 2,
    contentId: 3,
    contentSrc: "assets/mauvais_sang.jpg",
    contentTxt: "레오 까락스, <나쁜 피> (1986)",
  },
  {
    accountId: 2,
    contentId: 4,
    contentSrc: "assets/lily_chouchou.jpg",
    contentTxt: "이와이 슌지, <릴리 슈슈의 모든 것> (2001)",
  },
  {
    accountId: 2,
    contentId: 5,
    contentSrc: "assets/space_odyssey_2001.jpg",
    contentTxt: "스탠리 큐브릭, <2001 스페이스 오디세이> (1968)",
  },
  {
    accountId: 2,
    contentId: 6,
    contentSrc: "assets/the_lobster.jpg",
    contentTxt: "요르고스 란티모스, <더 랍스터> (2015)",
  },

  {
    accountId: 2,
    contentId: 7,
    contentSrc: "assets/playtime.jpg",
    contentTxt: "자크 타티, <플레이타임> (1967)",
  },
  {
    accountId: 2,
    contentId: 8,
    contentSrc: "assets/nope.jpeg",
    contentTxt: "조던 필, <놉> (2022)",
  },
  {
    accountId: 2,
    contentId: 9,
    contentSrc: "assets/man_with_camera.jpg",
    contentTxt: "지가 베르토프, <카메라를 든 사나이> (1929)",
  },
];

///////////////////////////////////////////////////
// sample accounts
const accountList = [
  {
    accountId: 1, // account의 순서를 지정
    accountName: "날으는솜뭉치", // account의 이름 지정
    accountSrc: "assets/image1.jpg", // account의 프로필 사진 지정
    accountTxt: "feat. 서울대학교 야조회", // account의 한 줄 소개 지정
  },
  {
    accountId: 2,
    accountName: "영덕대게",
    accountSrc: "assets/youngduck_crab.jpg",
    accountTxt: "영화 덕후 대박 계정",
  },
  {
    accountId: 3,
    accountName: "관악구카푸어",
    accountSrc: "assets/a3profilepic.jpg",
    accountTxt: "관악구카푸어입니다. 카푸어가 되고싶다고요? 그럼 들어오세요",
  },
];

///////////////////////////////////////////////////
// firebase
import { db } from "@/firebase";
import {
  collection,
  query,
  // doc,
  getDocs,
  addDoc,
  // updateDoc,
  // deleteDoc,
  orderBy,
} from "firebase/firestore";
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";

// DB의 facemo 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const facemoCollection = collection(db, "facemo");

/////////////////////////////////////////////////////

export default function Home() {
  // modal의 상태를 저장하는 변수입니다.
  const [modalOpened, setModalOpened] = useState(false);
  // 선택한 계정의 currentAccountId의 상태를 저장하는 변수입니다. (초기값은 음수로 설정. 홈페이지를 나타냄)
  const [currentAccountId, setCurrentAccountId] = useState(-1);
  // 선택한 콘텐츠의 currentContentId의 상태를 저장하는 변수입니다.
  const [currentContentId, setCurrentContentId] = useState(null);
  // 전체 replyList를 담는 변수입니다.
  const [replyList, setReplyList] = useState([]); // { contentId, replyId, replyEmoji, replyTxt, timestamp, justUpdated}

  // 아바타 보여줄지 말지를 결정
  const [showAvatars, setShowAvatars] = useState(false);

  const goToHome = () => {
    setCurrentAccountId(-1);
    setShowAvatars(false);
  };

  // 비디오 Ref를 담는 변수입니다.
  const videoRef = useRef(null);
  // 웹캠을 끄는 함수입니다.
  const stopWebcam = async () => {
    // videoRef가 null이 아닐 경우 실행
    if (!videoRef.current) {
      return;
    }
    // get stream
    const stream = await videoRef.current.srcObject;
    // delete track
    try {
      const tracks = await stream.getTracks();
      tracks[0].stop();
    } catch (error) {
      console.log("Error accessing the camera: " + error);
    }
    videoRef.current = null;
  };

  // modal을 열고 닫는 함수입니다.
  const openModal = () => {
    setModalOpened(true);
  };
  const closeModal = async () => {
    setModalOpened(false);
    setCurrentContentId(null);
    turnoffReply();
  };

  // replyData 불러오기
  // replyData = { contentId, replyId, replyEmoji, replyTxt, timestamp}
  const getReply = async () => {
    // Firestore 쿼리 만들기
    const q = query(facemoCollection, orderBy("timestamp", "desc"));

    // Firestore에서 replyData를 조회합니다.
    const results = await getDocs(q);
    const newReply = [];

    //가져온 replyData를 replyList에 담습니다.
    results.docs.forEach((doc) => {
      newReply.push({ ...doc.data(), justUpdated: false });
    });

    setReplyList(newReply);
  };

  // 마운트시 firebase에서 replyList 가져오기
  useEffect(() => {
    getReply();
    console.log(replyList);
  }, []);

  // 기존의 updatedStatus를 false로 변경합니다.
  const turnoffReply = () => {
    const turnoffReplyList = replyList.map((reply) => {
      if (reply.justUpdated) {
        return { ...reply, justUpdated: false };
      } else {
        return reply;
      }
    });
    setReplyList(turnoffReplyList);
  };

  // replyData 업로드하기
  const uploadReply = async (replyData) => {
    // Firestore에 추가한 replyData를 저장합니다.
    const docRef = await addDoc(facemoCollection, {
      contentId: replyData.contentId,
      replyId: replyData.replyId,
      replyEmoji: replyData.replyEmoji,
      replyTxt: replyData.replyTxt,
      timestamp: replyData.timestamp,
    });

    // 기존의 updatedStatus를 false로 변경합니다.
    const turnoffReplyList = replyList.map((reply) => {
      if (reply.justUpdated) {
        return { ...reply, justUpdated: false };
      } else {
        return reply;
      }
    });

    // ReplyList를 업데이트합니다.
    setReplyList([
      ...turnoffReplyList,
      {
        contentId: replyData.contentId,
        replyId: replyData.replyId,
        replyEmoji: replyData.replyEmoji,
        replyTxt: replyData.replyTxt,
        timestamp: replyData.timestamp,
        justUpdated: true,
      },
    ]);
  };

  return (
    <div className="bg-white h-screen">
      {currentAccountId < 0 ? (
        <div>
          <HomePage
            accountList={accountList}
            handleAccountClick={setCurrentAccountId}
            HomeIcon={HomeIcon}
            showAvatars={showAvatars}
            setShowAvatars={setShowAvatars}
          />
        </div>
      ) : (
        <>
          {/* 홈 버튼 */}
          <button
            className="absolute top-4 left-4 p-2 rounded-md bg-transparent hover:bg-white focus:outline-none"
            onClick={goToHome}
          >
            <HomeIcon className="h-6 w-6 text-black opacity-75" />
          </button>
          <div className="flex flex-col justify-center items-center">
            {/* Render accountSrc, accountName, accountTxt */}
            <div className="">
              {accountList
                .filter((account) => account.accountId === currentAccountId)
                .map((account) => (
                  <div className="flex flex-row gap-5 mt-10 mb-10">
                    <div>
                      <Avatar
                        src={account.accountSrc}
                        alt={account.accountId}
                        size="xxl"
                        className="border-black border-1"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <Typography
                        variant="h6"
                        color="black"
                        className="text-3xl"
                      >
                        {account.accountName}
                      </Typography>
                      <Typography
                        variant="large"
                        color="gray"
                        className="font-normal"
                      >
                        {account.accountTxt}
                      </Typography>
                    </div>
                  </div>
                ))}
            </div>
            {/* Render thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {currentAccountId > 0 &&
                contentList
                  .filter((content) => content.accountId === currentAccountId)
                  .map((content) => (
                    <Thumbnail
                      key={content.contentId}
                      content={content}
                      openModal={openModal}
                      setCurrentContentId={setCurrentContentId}
                    />
                  ))}
            </div>
          </div>
        </>
      )}

      {/* Render modal */}
      {modalOpened && (
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          {/* 모달 창밖 레이어. 주변을 어둡게 하고 클릭 시 모달이 꺼지게 한다. -> 실행 안 됨. */}
          <div onClick={closeModal}></div>
          {/* 모달 창 */}
          <Modal
            contentList={contentList}
            replyList={replyList}
            currentAccountId={currentAccountId}
            currentContentId={currentContentId}
            closeModal={closeModal}
            uploadReply={uploadReply}
            videoRef={videoRef}
            stopWebcam={stopWebcam}
          />
        </div>
      )}
    </div>
  );
}
