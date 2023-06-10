import { Avatar, Typography, Button } from "@material-tailwind/react";

export default function Example() {
return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen space-y-10">
      <div className="flex items-center gap-8">
        <Avatar src="/assets/image4.jpg" alt="avatar" size="xl" variant="rounded" className="border-black border-2" />
        <div>
          <Typography variant="h6">계정 1</Typography>
          <Typography variant="large" color="gray" className="font-normal">노예 1</Typography>
        </div>
        <Button color="blue" size="regular">Button 1</Button>
      </div>
      <div className="flex items-center gap-8">
        <Avatar
          src="/assets/image4.jpg"
          alt="avatar"
          variant="rounded"
          size="xl"
          className="border-black border-2"
        />
        <div>
          <Typography variant="h6">계정 2</Typography>
          <Typography variant="large" color="gray" className="font-normal">노예 2</Typography>
        </div>
        <Button color="blue" size="regular">Button 2</Button>
      </div>
      <div className="flex items-center gap-8">
        <Avatar src="/assets/image4.jpg" alt="avatar" variant="rounded" size="xl" className="border-black border-2" />
        <div>
          <Typography variant="h6">계정 3</Typography>
          <Typography variant="large" color="gray" className="font-normal">노예 3</Typography>
        </div>
        <Button color="blue" size="regular">Button 3</Button>
      </div>
    </div>
  );
}