const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
///////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import Thumbnail from "@/components/Thumbnail";
import Modal from "@/components/Modal";

///////////////////////////////////////////////////////
// samples
const contentList = [
  {
    contentId: 1,
    contentSrc: "assets/image1.jpg",
    contentTxt: "",
  },
  {
    contentId: 2,
    contentSrc: "assets/image2.jpg",
    contentTxt: "",
  },
  {
    contentId: 3,
    contentSrc: "assets/image3.jpg",
    contentTxt: "",
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

// DB의 facemo 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const facemoCollection = collection(db, "facemo");

/////////////////////////////////////////////////////

export default function Home() {
  // modal의 상태를 저장하는 변수입니다.
  const [modalOpened, setModalOpened] = useState(false);

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
    const originalReplyList = replyList.map((reply) => {
      if (reply.justUpdated) {
        return { ...reply, justUpdated: false };
      } else {
        return reply;
      }
    });

    // ReplyList를 업데이트합니다.
    setReplyList([
      ...originalReplyList,
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
    <div>
      {/* Render thumbnails */}
      {contentList.map((content) => (
        <Thumbnail
          key={content.contentId}
          content={content}
          openModal={openModal}
          setCurrentContentId={setCurrentContentId}
        />
      ))}

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
