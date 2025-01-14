// Load models for face detection and recognition
console.log("Model already loaded...");
const video2 = document.getElementById('video2');

// Start video from user's webcam
function startVideo2() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video2.srcObject = stream;
            video2.addEventListener('loadedmetadata', () => {
                video2.play();  // Ensure video starts playing
            });
        })
        .catch(err => {
            console.error('Error accessing video:', err)
            alert('Unable to access webcam. Please ensure you have given the necessary permissions or try another browser.');
        });
}

// Real-time facial recognition, landmarks, and expression detection
video2.addEventListener('play', () => {
    const canvas = document.getElementById('overlay2');

    // Set canvas size to match the video element's size
    const displaySize = { width: video2.videoWidth, height: video2.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        // Detect faces, landmarks, and expressions
        const detections = await faceapi.detectSingleFace(video2, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()

        // Check if detections are found
        if (!detections) {
            console.warn("No face detected");
            return; 
        }
        // Resize the detection to match the video display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Clear the canvas and draw the updated detections
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw detections: landmarks, boxes, and expressions
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Log the detections for debug purposes
        // console.log(resizedDetections);
    }, 100);  // Continuously update every 100ms
});

const verifyFace = document.getElementById("verify-face");

// Verify face for facial registration
document.getElementById('verify-face').addEventListener('click', async function () {
    verifyFace.innerText = "Processing..."
    verifyFace.style.backgroundColor = "grey"
    
    // Use tinyFaceDetector for face detection with specified options
    const detections = await faceapi.detectSingleFace(video2, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()  // Detect facial landmarks
    .withFaceDescriptor();  // Get face descriptor for face recognition
    
    // console.log(detections);

    // Check if any face was detected
    if (!detections) {
        alert('No face detected. Please try again.');
        return;
    }

    // Get facial descriptor
    // Unique vector for face recognition
    const facialData = detections.descriptor; 
    // console.log("from face_verification.js", facialData)

    // Send the face descriptor to the server for verification
    try {
        const response = await fetch('/api/auth/verify-face-for-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({facialData})
        });
    
        const result = await response.json();
        if (result.message === 'Facial recognition successful. Access granted.') {
            alert("Facial recognition successful. Access granted.");
            window.location.href = 'result.html';  // Redirect to result page
        } else {
            alert('Facial recognition failed. Access denied.');
        }
    } catch (error) {
        console.error('Error verifying face:', error);
        alert('An error occurred while verifying your face. Please try again.');
    }    
});