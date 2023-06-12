import React, { useEffect, useState, useRef } from "react";

// const emojiList = [
//   {
//     contentId: 1,
//     contentSrc: "assets/angry_emoji.jpg",
//   },
//   {
//     contentId: 2,
//     contentSrc: "assets/fearful_emoji.jpg",
//   },
//   {
//     contentId: 3,
//     contentSrc: "assets/happy_emoji.jpg",
//   },
// ];

const Intro = () => {
  //   const elementRef = useRef(null);

  //   useEffect(() => {
  //     const observer = new IntersectionObserver((entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           // Element is in the viewport
  //           console.log("Element is framed in");
  //         } else {
  //           // Element is out of the viewport
  //           console.log("Element is framed out");
  //         }
  //       });
  //     });

  //     observer.observe(elementRef.current);

  //     // Clean up the observer when the component unmounts
  //     return () => {
  //       observer.unobserve(elementRef.current);
  //     };
  //   }, []);

  //   return (
  //     <div className="flex flex-col overflow-hidden">
  //       <div className="flex justify-around animate-slide-left">
  //         <img
  //           src="assets/angry_emoji.png"
  //           alt="angry"
  //           className="w-1/5 h-auto m-3"
  //           ref={elementRef}
  //         />
  //       </div>
  //     </div>
  //   );
  // };

  // export default Intro;
  return (
    <div className="absolute -top-20 flex flex-col overflow-hidden">
      <div className="flex justify-around animate-slide-left">
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
      </div>
      <div className="flex justify-around animate-slide-right">
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
      </div>
      <div className="flex justify-around animate-slide-left">
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/angry_emoji.png"
          alt="angry"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/fearful_emoji.png"
          alt="fearful"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/neutral_emoji.png"
          alt="neutral"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/happy_emoji.png"
          alt="happy"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/sad_emoji.png"
          alt="sad"
          className="w-1/5 h-auto m-3"
        />
        <img
          src="assets/surprised_emoji.png"
          alt="surprised"
          className="w-1/5 h-auto m-3"
        />
      </div>
    </div>
  );
};

export default Intro;
