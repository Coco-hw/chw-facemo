const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
///////////////////////////////////////////////////////////////////

import React, { useState } from "react";
import Thumbnail from "@/components/thumbnail";
import Modal from "@/components/modal";
import { DetectEmoji } from "@/components/DetectEmoji";
import { Bundle } from "@/components/Bundle";

///////////////////////////////////////////////////////
// samples
const contentList = [
  {
    contentId: 1,
    contentSrc: "assets/image1.jpg",
    replyList: ["😄", "😍", "🥰"],
  },
  {
    contentId: 2,
    contentSrc: "assets/image2.jpg",
    replyList: ["😄", "😍", "🥰"],
  },
  {
    contentId: 3,
    contentSrc: "assets/image3.jpg",
    replyList: ["😄", "😍", "🥰"],
  },
];
///////////////////////////////////////////////////
// firebase
// import { db } from "@/firebase";
// import {
//   collection,
//   query,
//   doc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   orderBy,
// } from "firebase/firestore";

// // DB의 facemo 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
// const facemoCollection = collection(db, "facemo");

/////////////////////////////////////////////////////

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContentId, setCurrentContentId] = useState(null);
  // const [replyList, setReplyList] = useState();

  // modal창을 엽니다
  const openModal = () => {
    setModalOpen(true);
  };

  // modal창을 닫고 선택된 currentContentId를 삭제합니다.
  const closeModal = () => {
    setModalOpen(false);
    setCurrentContentId(null);
  };

  // replyData 불러오기
  // replyData = { contentId, replyId, replyEmoji, replyTxt, timestamp}
  // const getReply = async () => {
  //   // Firestore 쿼리 만들기
  //   const q = query(facemoCollection, orderBy("timestamp", "desc"));

  //   // Firestore에서 replyData를 조회합니다.
  //   const results = await getDocs(q);
  //   const newReply = [];

  //   //가져온 replyData를 newReply 배열에 담습니다.
  //   results.docs.forEach((doc) => {
  //     newReply.push({ contentId: doc.contentId, replyId:doc.replyId, replyEmoji:doc.replyEmoji, replyTxt:doc.replyTxt, timestamp:doc.timestamp})
  //   })
  // }

  // replyData 업로드하기
  // const uploadReply = async (replyData) => {
  //   const { contentId, replyId, timestamp, replyTxt } = replyData;

  //   try {
  //     // Get the reference to the 'replies' subcollection of the specific content document
  //     const contentRef = doc(db, 'facemo', contentId);
  //     const repliesRef = collection(contentRef, 'replies');

  //     // Create a new reply document with the given data
  //     const newReply = {
  //       timestamp: timestamp,
  //       replyTxt: replyTxt,
  //     };

  // }

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
      {modalOpen && (
        <Modal
          contentList={contentList}
          currentContentId={currentContentId}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
