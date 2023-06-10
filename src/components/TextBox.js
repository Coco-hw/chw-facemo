import { Textarea, Button, IconButton } from "@material-tailwind/react";
import { LinkIcon } from "@heroicons/react/24/outline";
 
const TextBox = () => {
  return (
    <div className="relative w-[32rem]">
      <Textarea variant="static" placeholder="Your Comment" rows={8} />
      <div className="w-full flex justify-between py-1.5">
        <IconButton variant="text" color="blue-gray" size="sm">
          <LinkIcon strokeWidth={2} className="w-4 h-4" />
        </IconButton>
        <div className="flex gap-2">
          <Button
            size="sm"
            color="red"
            variant="text"
            className="rounded-md"
          >
            Cancel
          </Button>
          <Button size="sm" className="rounded-md">Post Comment</Button>
        </div>
      </div>
    </div>
  );
}

export default TextBox;