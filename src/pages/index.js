const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
///////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContentId, setCurrentContentId] = useState(null);
  const [replyList, setReplyList] = useState([]); // { contentId, replyId, replyEmoji, replyTxt, timestamp, justUpdated}

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
      newReply.push({ 
        contentId: doc.contentId, 
        replyId:doc.replyId, 
        replyEmoji:doc.replyEmoji, 
        replyTxt:doc.replyTxt, 
        timestamp:doc.timestamp,
        justUpdated:false      
      })
    })

    setReplyList(newReply);
  }
  // 마운트시 firebase에서 replyList 가져오기
  useEffect(() => {
    getReply();
  }, []);

  // replyData 업로드하기
  const uploadReply = async(replyData) => {

    // Firestore에 추가한 replyData를 저장합니다.
    const docRef = await addDoc(facemoCollection, {
      contentId: replyData.contentId,
      replyId: replyData.replyId,
      replyEmoji: replyData.replyEmoji,
      replyTxt: replyData.replyTxt,
      timestamp: replyData.timestamp,
    }); 

    // 기존의 updatedStatus를 false로 변경합니다.
    const originalReplyList = replyList.map((reply)=>{
      if (reply.justUpdated){ return {...reply, justUpdated:false}; }
      else { return reply; }
    });

    // ReplyList를 업데이트합니다.
    setReplyList(...originalReplyList, {
      contentId: replyData.contentId,
      replyId: replyData.replyId,
      replyEmoji: replyData.replyEmoji,
      replyTxt: replyData.replyTxt,
      timestamp: replyData.timestamp,
      justUpdated: true
    });
  };

  // modal창을 엽니다
  const openModal = () => {
    setModalOpen(true);
  };

  // modal창을 닫고 선택된 currentContentId를 삭제합니다.
  const closeModal = () => {
    setModalOpen(false);
    setCurrentContentId(null);
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
      {modalOpen && (
        <Modal
          contentList={contentList}
          replyList={replyList}
          currentContentId={currentContentId}
          closeModal={closeModal}
          uploadReply={uploadReply}
        />
      )}
    </div>
  );
}
