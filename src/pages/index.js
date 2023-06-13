const inter = Inter({ subsets: ["latin"] });
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Button, Avatar, Typography } from "@material-tailwind/react";
import { HomeIcon } from "@heroicons/react/24/solid";
///////////////////////////////////////////////////////////////////

import React, { useState, useEffect, useRef } from "react";
import Thumbnail from "@/components/Thumbnail";
import Modal from "@/components/Modal";
// import P5Sketch from "@/components/P5Sketch";
import HomePage from "@/components/HomePage";

///////////////////////////////////////////////////
// firebase
import { db } from "@/firebase";
import {
  collection,
  query,
  // doc,
  getDocs,
  addDoc,
  // setDoc,
  // updateDoc,
  // deleteDoc,
  orderBy,
} from "firebase/firestore";
import { setActive } from "@material-tailwind/react/components/Tabs/TabsContext";

// DB의 facemo 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const facemoCollection = collection(db, "facemo");
const contentCollection = collection(db, "content");
const accountCollection = collection(db, "account");

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
  // 전체 contentList를 담는 변수입니다.
  const [contentList, setContentList] = useState([]);
  // 전체 accountList를 담는 변수입니다.
  const [accountList, setAccountList] = useState([]);

  // replyCountList를 담는 변수입니다.
  const [emojiCountList, setEmojiCountList] = useState([]);
  // 임시 replyCount입니다.
  const tempEmojiCount = {angry:0,disgusted:0,fearful:0,happy:0,neutral:0,sad:0,surprised:0};

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
    console.log("here!");
  };

  // const [s, sets] = useState(true);

  // uploadContent for the first time
  // const uploadContent = () => {
  //   contentList.map(async(content) => {
  //     const docRef = await addDoc(contentCollection, content);
  //   });
  // }
  // uploadAccount for the first time
  // const uploadAccount = () => {
  //   accountList.map(async(account) => {
  //     const docRef = await addDoc(accountCollection, account);
  //   });
  // }

  // One time only
  // useEffect(async() => {
  //   if(s){
  //     uploadContent();
  //     uploadAccount();
  //   }
  //   sets(false);
  // },[]);

  // contentData 불러오기
  const getContent = async () => {
    // Firestore 쿼리 만들기
    const q = query(contentCollection, orderBy("contentDB_id", "asc"));
    // Firestore에서 contentData를 조회합니다.
    const results = await getDocs(q);
    const newContent = [];
    // 가져온 contentData를 contentList에 담습니다.
    results.docs.forEach((doc) => {
      newContent.push({ ...doc.data() });
    });
    setContentList(newContent);
  };
  
  const getAccount = async() => {
    // Firestore 쿼리 만들기
    const q = query(accountCollection, orderBy("accountId", "asc"));
    // Firestore에서 accountData를 조회합니다.
    const results = await getDocs(q);
    const newAccount = [];
    // 가져온 contentData를 contentList에 담습니다.
    results.docs.forEach((doc) => {
      newAccount.push({ ...doc.data() });
    });
    setAccountList(newAccount);
  };

  // replyData 불러오기
  // replyData = { contentId, replyId, replyEmoji, replyTxt, timestamp}
  const getReply = async () => {
    // Firestore 쿼리 만들기
    const q = query(facemoCollection, orderBy("timestamp", "desc"));

    // Firestore에서 replyData를 조회합니다.
    const results = await getDocs(q);
    const newReply = [];

    // 가져온 replyData를 replyList에 담습니다.
    results.docs.forEach((doc) => {
      newReply.push({ ...doc.data(), justUpdated: false });
    });

    setReplyList(newReply);
  };

  // 마운트시 firebase에서 replyList 가져오기
  useEffect(() => {
    getAccount();
    getContent();
    getReply();
  }, []);

  // emojiCount 업데이트
  const updateEmojiCountList = () => {
    let newEmojiCountList = [];
    contentList
      .filter((content)=> content.accountId===currentAccountId)
      .forEach((content)=>{
        // for each contentId,
        let emojiCount = {
          angry:0,
          disgusted:0,
          fearful:0,
          happy:0,
          neutral:0,
          sad:0,
          surprised:0
        }
        replyList
          .filter((reply)=>reply.accountId===currentAccountId && reply.contentId===content.contentId)
          .forEach((reply)=>{
            reply.replyEmoji.forEach((emoji)=>{
              emojiCount[emoji] = emojiCount[emoji]+1;
            });
          });
        newEmojiCountList.push({contentId:content.contentId, emojiCount:emojiCount});
      });
    setEmojiCountList(newEmojiCountList);
  }

  // replyList가 바뀔 때마다 emojiCount 업데이트
  useEffect(() => {
    if(currentAccountId > 0){
      updateEmojiCountList();
    }
  }, [currentAccountId, replyList]);

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
      accountId: replyData.accountId,
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
        accountId: replyData.accountId,
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
    <div className="relative bg-white w-screen p-8">
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
                      emojiCount={
                        emojiCountList.length
                        ?emojiCountList.find((item)=>item.contentId===content.contentId).emojiCount
                        :tempEmojiCount
                      }
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
      {modalOpened &&
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
      }
    </div>
  );
}
