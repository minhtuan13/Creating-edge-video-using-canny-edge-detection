function getBinaryEdgeImage(imageData, ctx){
    var width = imageData.width;
    var height = imageData.height;
    var data = imageData.data;
    var outputData = ctx.createImageData(width, height);

    var sobelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];
    var sobelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    for (var y = 1; y < height - 1; y++) {
        for (var x = 1; x < width - 1; x++) {
            var sumX = 0;
            var sumY = 0;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    var pixelIndex = ((y + i) * width + (x + j)) * 4;
                    var grayValue = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
                    sumX += grayValue * sobelX[i + 1][j + 1];
                    sumY += grayValue * sobelY[i + 1][j + 1];
                }
            }
            var magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
            var index = (y * width + x) * 4;
            outputData.data[index] = magnitude; // R
            outputData.data[index + 1] = magnitude; // G
            outputData.data[index + 2] = magnitude; // B
            outputData.data[index + 3] = 255; // A
        }
    }
    return outputData;
}

function getBinaryEdgeVideo() {
    // Wait for the video element to be ready
    document.getElementById('myVideo').addEventListener('loadedmetadata', function() {
        // Get the video element
        var video = document.getElementById('myVideo');

        // Get the canvas element
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        // Set canvas dimensions to match video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Function to capture frame
        function captureFrame() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            var image = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // get binaryEdgeImage
            var BEI = getBinaryEdgeImage(image, ctx);

            ctx.putImageData(BEI, 0, 0);
            

        }

        // Listen for the 'play' event and start capturing frames
        video.addEventListener('play', function() {
            setInterval(captureFrame, 10); // Capture a frame every 10 milliseconds (adjust as needed)
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    getBinaryEdgeVideo();
});
window.onload = function() {
    var video = document.getElementById('myVideo');
    var canvas = document.getElementById('myCanvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
};
