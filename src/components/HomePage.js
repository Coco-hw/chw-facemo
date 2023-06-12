import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Avatar, Typography } from "@material-tailwind/react";
import Intro from "@/components/Intro";

const HomePage = ({
  accountList,
  handleAccountClick,
  HomeIcon,
  showAvatars,
  setShowAvatars,
}) => {
  const router = useRouter();

  // homepage의 시작하기 버튼을 담당
  const handleStartClick = () => {
    setShowAvatars(true);
  };

  return (
    <>
      {showAvatars ? (
        <>
          {/* 홈 버튼 */}
          <button
            className="absolute top-4 left-4 p-2 rounded-md bg-transparent hover:bg-white focus:outline-none"
            onClick={() => setShowAvatars(false)}
          >
            <HomeIcon className="h-6 w-6 text-black opacity-75" />
          </button>

          <div className="flex flex-col justify-center items-center gap-6 h-screen space-y-10">
            <div className="text-6xl font-bold tracking-tight text-black">
              계정을 선택해 주세요 😉
            </div>
            {accountList.map((account) => (
              <div className="flex items-center justify-center gap-6 w-1/2">
                {/* 프로필 사진 */}
                <Avatar
                  src={account.accountSrc}
                  alt={account.accountId}
                  size="xl"
                  variant="rounded"
                  className="border-black border-2"
                />
                {/* 계정명 및 한 줄 소개 */}
                <div className="basis-1/2">
                  <Typography variant="h6" color="black" className="text-lg">
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
                {/* 바로가기 버튼 */}
                <Button
                  color="gray"
                  size="regular"
                  onClick={() => handleAccountClick(account.accountId)}
                >
                  구경하기
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="relative x-0 y-0 w-screen h-screen">
          <div className="absolute w-screen h-screen inset-0 z-10 bg-black opacity-30"></div>
          <Intro />
          <div className="absolute inset-0 z-20">
            <div className="flex flex-col justify-center items-center h-screen bg-slate-300">
              <div className="text-center mb-20 text-9xl font-bold tracking-tight text-black">
                FacEMO.
              </div>
              <Button size="lg" color="gray" onClick={handleStartClick}>
                시작하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
