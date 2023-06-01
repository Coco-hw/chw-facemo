import React, { useState } from 'react';
import Camera from '@/components/camera';

// return hovering canvas with content image, camera, replyList
const Modal = ({ contentList, currentContentId, closeModal }) => {
  // find content from contentList which matches currentContentId
  const content = contentList.find((item) => item.contentId === currentContentId);

  if (!content) {
    return null;
  }

  // get contentSrc , replyList from content
  const { contentSrc, replyList } = content;
  // if showCamera===true: show <Camera> instead of replyList
  const [showCamera, setShowCamera] = useState(true);

  // function to deactivate showCamera
  const handleCameraClick = () => {
    setShowCamera(false);
  };

  // Render
  return (
    <div className="fixed inset-0 flex justify-center items-center z-10">
      <div className="relative w-2/3 bg-white rounded-lg p-4">

        {/* close button */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>
          X
        </button>

        {/* image and replyList(Camera) box */}
        <div className="flex">

          {/* contentSrc(image) */}
          <div className="w-2/3">
            <img
              src={contentSrc}
              alt={`Content ${currentContentId}`}
              style={{ width: '300px', height: '300px', objectFit: 'cover' }}
            />
          </div>

          {/* Camera or replyList */}
          {showCamera ? (
            <div>
              <div className="h-full flex justify-center items-center">
                <Camera onCameraClick={handleCameraClick} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-200">
              <ul>
                {replyList.map((reply, index) => (
                  <li key={index}>{reply}</li>
                ))}
              </ul>
            </div>
          )}
        
        </div>
      </div>
    </div>
  );
};

export default Modal;
