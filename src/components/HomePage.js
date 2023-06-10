import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Avatar, Typography } from "@material-tailwind/react";

const HomePage = ({ accountList, handleAccountClick }) => {
  const router = useRouter();
  const [showAvatars, setShowAvatars] = useState(false);

  // homepage의 시작하기 버튼을 담당
  const handleStartClick = () => {
    setShowAvatars(true);
  };

  return (
    <>
      {showAvatars ? (
        <div className="flex flex-col justify-center items-center gap-6 h-screen space-y-10">
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
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="text-center mb-20 text-9xl font-bold tracking-tight text-black">
            FacEMO.
          </div>
          <Button size="lg" color="gray" onClick={handleStartClick}>
            시작하기
          </Button>
        </div>
      )}
    </>
  );
};

export default HomePage;
