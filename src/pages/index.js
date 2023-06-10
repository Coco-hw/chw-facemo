const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Button } from "@material-tailwind/react";
///////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import Thumbnail from "@/components/Thumbnail";
import Modal from "@/components/modal";
import Intro from "@/components/Intro";
// import P5Sketch from "@/components/P5Sketch";

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
    turnoffReply();

    // ReplyList를 업데이트합니다.
    setReplyList([
      ...replyList,
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
      {/* <P5Sketch /> */}
      <Intro />
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
    </div>
  );
}

// 메인페이지 css 메인페이지 및 계정 선택 페이지 index파일
//import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Avatar, Typography } from "@material-tailwind/react";
//export default function HomePage() {
// const router = useRouter();
// const [showAvatars, setShowAvatars] = useState(false);

//const handleStartClick = () => {
//  setShowAvatars(true);
 // };

 // if (showAvatars) {
 //   return (
 //     <div className="flex flex-col gap-6 items-center justify-center h-screen space-y-10">
 //       <div className="flex items-center gap-8">
 //         <Avatar src="/assets/image4.jpg" alt="avatar" size="xl" variant="rounded" className="border-black border-2" />
 //         <div>
 //           <Typography variant="h6">계정 1</Typography>
 //           <Typography variant="large" color="gray" className="font-normal">노예 1</Typography>
 //         </div>
 //         <Button color="blue" size="regular">Pick Me!</Button>
 //       </div>
 //       <div className="flex items-center gap-8">
 //         <Avatar
 //           src="/assets/image4.jpg"
 //           alt="avatar"
 //           variant="rounded"
 //           size="xl"
 //           className="border-black border-2"
 //         />
 //         <div>
 //           <Typography variant="h6">계정 2</Typography>
 //           <Typography variant="large" color="gray" className="font-normal">노예 2</Typography>
 //         </div>
 //         <Button color="blue" size="regular">Why not?</Button>
 //       </div>
 //       <div className="flex items-center gap-8">
 //         <Avatar src="/assets/image4.jpg" alt="avatar" variant="rounded" size="xl" className="border-black border-2" />
 //         <div>
 //           <Typography variant="h6">계정 3</Typography>
 //           <Typography variant="large" color="gray" className="font-normal">노예 3</Typography>
 //         </div>
 //         <Button color="blue" size="regular">Please Choose me...</Button>
 //       </div>
 //     </div>
 //   );
 // }

//  return (
 //   <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
//  <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "200px", fontWeight: "bold", letterSpacing: "-10px" }}>FacEMO</div>
//    <Button size="lg" onClick={handleStartClick}>시작하기</Button>
//  </div>
//);
//}

