import React, { useState, useEffect } from 'react';
import Bundle from '@/components/Bundle';

// return hovering canvas with content image, camera, replyList
const Modal = ({ contentList, replyList, currentContentId, closeModal, bundleOpened, openBundle, closeBundle, uploadReply, intervalRef }) => {

  // find current content from contentList which matches currentContentId // contentList = [{contentId, contentSrc}, ... ]
  const currentContent = contentList.find((item) => item.contentId === currentContentId);

  // find current replyList from replyList which matches currentContentId // replyList = [ {contentId, replyId, replyEmoji, replyTxt, timestamp}, ... ]
  const [currentReplyList, setCurrentReplyList] = useState([]);

  // update replyList when first rendered & replyList updated
  useEffect(()=>{
    if (replyList){
      setCurrentReplyList( replyList.filter((item) => item.contentId === currentContentId) );
    }
  }, [replyList]);

  // Render
  return (
    <div className="fixed inset-0 flex justify-center items-center z-10 pt-8">
      <div className="relative w-2/3 bg-white rounded-lg p-4">

        {/* close button */}
        <button className="absolute top-2 right-2 text-gray-500" onClick={closeModal}>
          X
        </button>

        {/* image and {Bundle or replyList} box */}
        <div className="flex">

          {/* contentSrc(image) */}
          <div className="w-2/3">
            <img
              src={currentContent.contentSrc}
              alt={`Content ${currentContentId}`}
              style={{ width: '500px', height: '700px', objectFit: 'cover' }}
            />
          </div>

          {/* Bundle or emojiList */}
          {bundleOpened ? (
            <div>
              <div className="h-full flex justify-center items-center">
                <Bundle 
                currentContentId={currentContentId}
                closeBundle={closeBundle} 
                uploadReply={uploadReply}
                intervalRef={intervalRef}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-200">
              {/* emoji list */}
              <ul>
                {currentReplyList.map((item) => (
                  <li key={item.replyId}>{item.replyEmoji}</li>
                ))}
              </ul>
              {/* retake pic button */}
              <button 
              className="bg-blue-500 text-white px-2 rounded mt-4"
              onClick={openBundle}>
                retake picture
              </button>
            </div>
          )}
        
        </div>
      </div>
    </div>
  );
};

export default Modal;
