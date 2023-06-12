import { Input, Textarea, Card, Button, IconButton } from "@material-tailwind/react";
import { BackwardIcon } from "@heroicons/react/24/solid";

const TextBox = ({currentEmoji, inputTxt,  setInputTxt, sampleTxt, restartVideo, savePhoto}) => {
  return (
    <div>
      <Input
        label="무엇을 느꼈나요? (최대 20자)"
        placeholder={sampleTxt}
        value={inputTxt}
        maxLength={20}
        onChange={(e) => setInputTxt(e.target.value)}
      />
      <div className="w-full flex flex-row justify-around mt-3 gap-2">
        <Button className="basis-1/2" color="white" onClick={restartVideo}>
          Try Again
        </Button>
        <Button className="basis-1/2" color="white" onClick={savePhoto}>
          OK
        </Button>
      </div>
    </div>

    // <Card className="my-4 mx-full relative flex flex-row">
    //     <Button onClick={restartVideo} color="amber">
    //       <BackwardIcon className="h-6 w-6"/>
    //     </Button>
    //     <Textarea
    //       variant="static"
    //       placeholder={sampleTxt}
    //       value={inputTxt}
    //       onChange={(e) => setInputTxt(e.target.value)}
    //     />
    //     <Button className="basis-1/3" color="white" onClick={savePhoto}>
    //       OK
    //     </Button>
    // </Card>
  );
}

export default TextBox;