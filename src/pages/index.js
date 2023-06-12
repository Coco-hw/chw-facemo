const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Button, Avatar, Typography } from "@material-tailwind/react";
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
];

///////////////////////////////////////////////////
// sample accounts
const accountList = [
  {
    accountId: 1, // account의 순서를 지정
    accountName: "계정 1", // account의 이름 지정
    accountSrc: "assets/image1.jpg", // account의 프로필 사진 지정
    accountTxt: "소개 1", // account의 한 줄 소개 지정
  },
  {
    accountId: 2,
    accountName: "계정 2",
    accountSrc: "assets/image2.jpg",
    accountTxt: "영화를 좋아해요.",
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
    <div className="bg-white">
      {currentAccountId < 0 ? (
        <HomePage
          accountList={accountList}
          handleAccountClick={setCurrentAccountId}
        />
      ) : (
        <div>
          {/* Render thumbnails */}
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
      )}

      {/* Render modal */}
      {modalOpened && (
        <Modal
          contentList={contentList}
          replyList={replyList}
          currentContentId={currentContentId}
          closeModal={closeModal}
          uploadReply={uploadReply}
          videoRef={videoRef}
          stopWebcam={stopWebcam}
        />
      )}
    </div>
  );
}
