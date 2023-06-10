import { Textarea, Card, Button, IconButton } from "@material-tailwind/react";
import { BackwardIcon } from "@heroicons/react/24/solid";
 
const TextBox = ({currentEmoji, inputTxt,  setInputTxt, sampleTxt, restartVideo, savePhoto}) => {
  return (
    <Card className="my-4 mx-full relative flex flex-row">
        <Button onClick={restartVideo} color="amber">
          <BackwardIcon className="h-6 w-6"/>
        </Button>
        <Textarea
          variant="static"
          placeholder={sampleTxt}
          value={inputTxt}
          onChange={(e) => setInputTxt(e.target.value)}
        />
        <Button className="basis-1/3" color="white" onClick={savePhoto}>
          OK
        </Button>
    </Card>
  );
}

export default TextBox;