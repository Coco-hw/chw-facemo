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
          <div className="text-6xl font-bold tracking-tight text-black">
            아래 마음에 드는 계정을 선택해주세요
          </div>
          {accountList.map((account) => (
            <div className="flex items-center gap-8">
              {/* 프로필 사진 */}
              <Avatar
                src={account.accountSrc}
                alt={account.accountId}
                size="xl"
                variant="rounded"
                className="border-black border-2"
              />
              {/* 계정명 및 한 줄 소개 */}
              <div>
                <Typography variant="h6" color="black">
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
