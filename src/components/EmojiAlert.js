import { Fragment } from "react";
import { Alert, Typography } from "@material-tailwind/react";
import { FaceFrownIcon } from "@heroicons/react/24/solid";

const EmojiAlert = ({ open }) => {
  return (
    <Fragment className="">
      <Alert
        variant="gradient"
        color="red"
        icon={<FaceFrownIcon className="h-6 w-6" />}
        open={open}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        className="absolute bottom-12"
      >
        <Typography variant="h5" color="white">
          표정 분석에 실패했어요!
        </Typography>
        <Typography color="white" className="mt-2 font-normal">
          얼굴을 정중앙에 맞춰주세요
        </Typography>
      </Alert>
    </Fragment>
  );
};
export default EmojiAlert;
