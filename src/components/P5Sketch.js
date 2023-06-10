// import { useEffect, useRef } from "react";
// import p5 from "p5";

// const P5Sketch = () => {
//   const sketchRef = useRef(null);
//   const images = []; // Array to store the images
//   console.log(images);
//   useEffect(() => {
//     // Create the p5.js sketch

//     const sketch = new p5((p) => {
//       p.preload = () => {
//         if (typeof window !== "undefined") {
//           // Load the images from the 'assets' folder
//           images.push(p.loadImage("/assets/angry_emoji.png"));
//           images.push(p.loadImage("/assets/fearful_emoji.png"));
//           images.push(p.loadImage("/assets/happy_emoji.png"));
//           images.push(p.loadImage("/assets/neutral_emoji.png"));
//           images.push(p.loadImage("/assets/sad_emoji.png"));
//           images.push(p.loadImage("/assets/surprised_emoji.png"));
//         }
//       };
//       console.log(images);

//       p.setup = () => {
//         // Check if the window object exists before accessing its properties
//         if (typeof window !== "undefined") {
//           p.createCanvas(window.innerWidth, window.innerHeight).parent(
//             sketchRef.current
//           );
//         }
//       };

//       p.draw = () => {
//         if (typeof window !== "undefined") {
//           p.background(220);
//           // Display the images at their positions
//           for (let i = 0; i < images.length; i++) {
//             const image = images[i];
//             const xPos = (p.width / images.length) * i;
//             const yPos = p.height / 2;
//             p.imageMode(p.CENTER);
//             p.image(image, xPos, yPos);
//           }
//         }
//       };

//       p.windowResized = () => {
//         // Check if the window object exists before accessing its properties
//         if (typeof window !== "undefined") {
//           p.resizeCanvas(window.innerWidth, window.innerHeight);
//         }
//       };
//     });

//     // Store the sketch instance in the ref
//     sketchRef.current = sketch;

//     // Clean up the sketch when the component unmounts
//     return () => {
//       sketch.remove();
//     };
//   }, []);

//   return <div ref={sketchRef}></div>;
// };

// export default P5Sketch;
