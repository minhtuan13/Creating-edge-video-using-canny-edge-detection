


This project provides JavaScript functions to convert color images to grayscale and perform Canny edge detection on video frames. Utilizing the HTML5 Canvas API, this application enables real-time video processing directly in the browser, displaying the edge detection results instantly.

# Features
- Color to Grayscale Conversion: Simplifies image processing by reducing color information.
- Canny Edge Detection: Applies the Canny algorithm to identify edges in grayscale images.
- Real-Time Video Processing: Captures video frames and applies edge detection to each frame.
- Canvas Display: Renders the processed edge-detected images directly on an HTML <canvas> element.

# Requirements
- Browser Support: Modern browsers that support HTML5, Canvas, and JavaScript.
- Video File: A video file for processing (common formats like MP4, WebM).
- Basic Knowledge: Familiarity with HTML and JavaScript to integrate the code into your web project.

# Code Explanation
1. grayscale(imageData)
Converts a color image to grayscale by averaging the RGB values of each pixel.

2. getCannyEdgeImage(imageData, ctx)
Performs the following steps:

- Converts the image to grayscale.
Calculates the gradient magnitude using Sobel operators for both X and Y directions.
- Applies thresholding to determine strong edges, weak edges, and non-edges.
- Returns the processed image data with edges highlighted.

3. getCannyEdgeVideo()
- Waits for the video metadata to load to determine video dimensions.
- Sets the canvas size to match the video.
- Captures each video frame, applies Canny edge detection, and displays the result on the canvas.
- Continues processing frames while the video is playing.
