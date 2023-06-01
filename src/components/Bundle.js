import React, { useState } from 'react';
import Camera from '@/components/Camera';
import DetectEmoji from '@/components/DetectEmoji';

const Bundle = ({closeBundle}) => {
  // Camera에서 업데이트할 imgSrc
  const [imgSrc, setImgSrc] = useState(null);
  // Camera에서 captured 여부
  const [captured, setCaptured] = useState(false);

  const startDetact = () => {
    setCaptured(true);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200">
      <div>
        {/* content */}
        <div>
          Undefined
          {/* <Camera setImgSrc={setImgSrc} startDetact={startDetact}/>
          <DetectEmoji imgSrc={imgSrc}/> */}
        </div>

        {/* close Bundle button */}
        <button
          className="bg-blue-500 text-white px-2 rounded mt-4"
          onClick={closeBundle}
        >
          Not now!
        </button>

      </div>
    </div>
  );
}

export default Bundle;