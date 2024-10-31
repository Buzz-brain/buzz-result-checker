// Load models for face-api.js
console.log("Loading face-api.js models...");
const video = document.getElementById('video');

Promise.all([
    // faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(() => {
    console.log("Models loaded successfully.");
    startVideo();
}).catch(err => {
    console.error('Error loading models:', err);
    alert('Error loading models. Please try refreshing the page or check your model paths.');
});

// Start video from user's webcam
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();  // Ensure video starts playing
            });
        })
        .catch(err => {
            console.error('Error accessing video:', err);
            alert('Unable to access webcam. Please ensure you have given the necessary permissions or try another browser.');
        });
}

// Real-time facial recognition, landmarks, and expression detection
video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay');
    
    // Set canvas size to match the video element's size
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        // Detect faces, landmarks, and expressions
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()

        // Check if detections are found
        if (!detections) {
            // console.warn("No face detected");
            return;  // Skip the rest of the loop if no face is detected
        }
        // Resize the detection to match the video display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear the canvas and draw the updated detections
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detections: landmarks, boxes, and expressions
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Log the detections for debug purposes
        // console.log(resizedDetections);
    }, 20);  // Continuously update every 100ms
});


const registerFace = document.getElementById("capture-face");

// Capture face for facial registration
document.getElementById('capture-face').addEventListener('click', async () => {
    registerFace.innerText = "Processing..."
    registerFace.style.backgroundColor = "grey"
    
    // Use tinyFaceDetector for face detection with specified options
    const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()  // Detect facial landmarks
    .withFaceDescriptor();  // Get face descriptor for face recognition
    
    // console.log(detections);

    // Check if any face was detected
    if (!detections) {
        alert('No face detected. Please try again.');
        return;
    }

    // Get registration number and the facial descriptor
    const regNo = document.getElementById('regNo').value;
    const facialData = detections.descriptor;  // Unique vector for face recognition

    // Send the facial data to server for registration
    const response = await fetch('/api/auth/register-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, facialData })
    });

    const data = await response.json();
    if (data.message === 'Facial data registered successfully.') {
        alert(data.message);
        pwdModal.style.display = "none";
        checkResultModal.style.display = "none";
        faceVerifyModal.style.display = "none";
        faceModal.style.display = "none";
        modal.style.display = "flex";
    } else {
        alert('An error occurred while registering facial data.');
    }
});

