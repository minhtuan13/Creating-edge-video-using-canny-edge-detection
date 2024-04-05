// Hàm chuyển đổi ảnh thành ảnh xám
function grayscale(imageData) {
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var gray = (data[i] + data[i + 1] + data[i + 2]) / 3; // Tính giá trị màu xám trung bình
        data[i] = data[i + 1] = data[i + 2] = gray; // Gán giá trị xám cho các kênh màu RGB
    }
    return imageData; // Trả về dữ liệu ảnh đã chuyển đổi
}

// Hàm thực hiện phát hiện biên Canny trên ảnh xám đầu vào
function getCannyEdgeImage(imageData, ctx) {
    var grayImage = grayscale(imageData); // Chuyển đổi ảnh thành ảnh xám
    var width = grayImage.width;
    var height = grayImage.height;
    var data = grayImage.data;
    var outputData = ctx.createImageData(width, height); // Tạo dữ liệu ảnh mới để lưu kết quả

    // Ma trận Sobel để tính toán độ dốc
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

    // Thực hiện phép tính Sobel để tính toán độ dốc
    var gradients = [];
    for (var y = 0; y < height; y++) {
        gradients[y] = [];
        for (var x = 0; x < width; x++) {
            var sumX = 0;
            var sumY = 0;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    var offsetX = x + j;
                    var offsetY = y + i;
                    if (offsetX >= 0 && offsetX < width && offsetY >= 0 && offsetY < height) {
                        var pixelIndex = (offsetY * width + offsetX) * 4;
                        var grayValue = data[pixelIndex];
                        sumX += grayValue * sobelX[i + 1][j + 1];
                        sumY += grayValue * sobelY[i + 1][j + 1];
                    }
                }
            }
            var magnitude = Math.sqrt(sumX * sumX + sumY * sumY); // Tính độ lớn của độ dốc
            gradients[y][x] = magnitude; // Lưu độ lớn vào mảng gradients
        }
    }

    // Áp dụng phát hiện biên Canny dựa trên ngưỡng
    var highThreshold = 100; // Ngưỡng cao
    var lowThreshold = 30; // Ngưỡng thấp

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var magnitude = gradients[y][x];
            var index = (y * width + x) * 4;
            if (magnitude >= highThreshold) {
                outputData.data[index] = outputData.data[index + 1] = outputData.data[index + 2] = 255; // Màu trắng
            } else if (magnitude >= lowThreshold) {
                outputData.data[index] = outputData.data[index + 1] = outputData.data[index + 2] = 128; // Màu xám
            } else {
                outputData.data[index] = outputData.data[index + 1] = outputData.data[index + 2] = 0; // Màu đen
            }
            outputData.data[index + 3] = 255; // Alpha
        }
    }

    return outputData; // Trả về dữ liệu ảnh đã xử lý biên Canny
}

// Hàm chụp frame và áp dụng phát hiện biên Canny cho video
function getCannyEdgeVideo() {
    // Chờ đến khi video được tải sẵn sàng
    document.getElementById('myVideo').addEventListener('loadedmetadata', function() {
        // Lấy video element
        var video = document.getElementById('myVideo');

        // Lấy canvas element
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        // Thiết lập kích thước canvas để phù hợp với kích thước video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Hàm chụp frame
        function captureFrame() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Vẽ frame lên canvas

            var image = ctx.getImageData(0, 0, canvas.width, canvas.height); // Lấy dữ liệu ảnh từ canvas

            // Áp dụng phát hiện biên Canny cho frame ảnh
            var edgeImage = getCannyEdgeImage(image, ctx);

            ctx.putImageData(edgeImage, 0, 0); // Hiển thị kết quả lên canvas
        }

        // Lắng nghe sự kiện 'play' của video và bắt đầu chụp frame
        video.addEventListener('play', function() {
            setInterval(captureFrame, 5); // Chụp một frame mỗi 5 mili giây (có thể điều chỉnh)
        });
    });
}

// Chạy hàm getCannyEdgeVideo khi trang web được tải hoàn toàn
document.addEventListener('DOMContentLoaded', function() {
    getCannyEdgeVideo();
});

// Thiết lập kích thước của canvas dựa trên kích thước video 
window.onload = function() {
    var video = document.getElementById('myVideo');
    var canvas = document.getElementById('myCanvas');
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
};


