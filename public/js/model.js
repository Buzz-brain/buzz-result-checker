// Load models for face-api.js
console.log("Loading face-api.js models...");
const video = document.getElementById('video');
const video2 = document.getElementById('video2');

Promise.all([
    // Get models locally
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(() => {
    console.log("Models loaded successfully.");
}).catch(err => {
    console.error('Error loading models:', err);
    alert('Error loading models. Please try refreshing the page or check your model paths.');
});

// Start video from user's webcam for facial registraton
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

// Start video from user's webcam for facial verification
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

// Stop video stream and remove access to camera
function stopVideoAndRemoveCameraAccess() {
    const videoStream = video.srcObject;
    if (videoStream) {
        videoStream.getTracks().forEach(track => {
            track.stop();
        });
    }
    video.srcObject = null;
}




// Real-time facial registration
video.addEventListener('play', () => {
    const canvas = document.getElementById('overlay');

    // Set canvas size to match the video element's size
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        // Detect faces, landmarks, and expressions
        const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()

        // Check if detections are found
        if (!detections) {
            // console.warn("No face detected");
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
        console.log(resizedDetections);
    }, 100);  // Continuously update every 100ms
});

// Real-time facial verification
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
            // console.warn("No face detected");
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




const registerFace = document.getElementById("capture-face");
const verifyFace = document.getElementById("verify-face");

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
        registerFace.innerText = "Capture Face";
        registerFace.style.backgroundColor = "";
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
        stopVideoAndRemoveCameraAccess();
    } else {
        alert('An error occurred while registering facial data.');
    }
});

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
        verifyFace.innerText = "Verify Face";
        verifyFace.style.backgroundColor = "";
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
            body: JSON.stringify({ facialData })
        });

        const result = await response.json();
        if (result.message === 'Facial recognition successful. Access granted.') {
            alert("Facial recognition successful. Access granted.");

            // Store the result data in local storage
            localStorage.setItem('resultData', JSON.stringify(result.result));

            // Redirect to the result page
            window.location.href = '/result';
        } else {
            alert('Facial recognition failed. Access denied.');
            verifyFace.innerText = "Verify Face";
            verifyFace.style.backgroundColor = "";
        }
    } catch (error) {
        console.error('Error verifying face:', error);
        alert('An error occurred while verifying your face. Please try again.');
    }
});

