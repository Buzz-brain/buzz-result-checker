// Login button, navbutton, modal and close button
const loginBtn = document.getElementsByClassName("loginBtn")[0];
const navLogin = document.getElementsByClassName("navLogin")[0];
const modal = document.getElementsByClassName("modal")[0];
const close = document.getElementsByClassName("close")[0];

// Change password modal and close button
const pwdModal = document.getElementsByClassName("pwdModal")[0];
const pwdClose = document.getElementsByClassName("pwdClose")[0];

// Check result button, navbutton, modal and close button
const checkResultButton = document.getElementsByClassName("checkResultButton")[0];
const navCheckResult = document.getElementsByClassName("navCheckResult")[0];
const checkResultModal = document.getElementsByClassName("checkResultModal")[0];
const checkResultClose = document.getElementsByClassName("checkResultClose")[0];

// Face registration modal and close btn
const faceModal = document.getElementsByClassName("faceModal")[0];
const faceClose = document.getElementsByClassName("faceClose")[0];

// Face verification modal and close btn
const faceVerifyModal = document.getElementsByClassName("faceVerifyModal")[0];
const faceVerifyClose = document.getElementsByClassName("faceVerifyClose")[0];

// For login
loginBtn.addEventListener("click", () => {
    modal.style.display = "flex";
})
navLogin.addEventListener("click", () => {
    modal.style.display = "flex";
})

// For Checking result
checkResultButton.addEventListener("click", () => {
    console.log("show")
    checkResultModal.style.display = "flex";
})
navCheckResult.addEventListener("click", () => {
    checkResultModal.style.display = "flex";
})

// For close buttons
close.addEventListener("click", () => {
    modal.style.display = "none";
})
faceClose.addEventListener("click", () => {
    faceModal.style.display = "none";
})
checkResultClose.addEventListener("click", () => {
    checkResultModal.style.display = "none";
})
pwdClose.addEventListener("click", () => {
    pwdModal.style.display = "none";
})
faceVerifyClose.addEventListener("click", () => {
    faceVerifyModal.style.display = "none";
})


// Submit login details event
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent the default form submission

    const regNo = document.getElementById('regNo').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, password })
    });

    const data = await response.json();
    alert(data.message);

    // Case 1: First-time login, change password
    if (data.firstLogin) {
        modal.style.display = "none";
        faceModal.style.display = "none";
        checkResultModal.style.display = "none";
        faceVerifyModal.style.display = "none";
        pwdModal.style.display = "flex";
    }

    // Case 2: If password is changed but facial registration is not done
    if (data.proceedToFaceRegistration) {
        modal.style.display = "none";
        pwdModal.style.display = "none";
        checkResultModal.style.display = "none";
        faceVerifyModal.style.display = "none";
        faceModal.style.display = "flex";
    }

    // Case 3: If both password is changed and facial data is registered, redirect to result checker
    if (data.redirectToResultChecker) {
        modal.style.display = "none";
        pwdModal.style.display = "none";
        faceModal.style.display = "none";
        faceVerifyModal.style.display = "none";
        checkResultModal.style.display = "flex";
    }

});

// Change password event
document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const regNo = document.getElementById('regNo').value;
    const newPassword = document.getElementById('new-password').value;

    const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo, newPassword })
    });

    const data = await response.json();
    alert(data.message);

    // After changing password, proceed to facial registration
    if (data.message === 'Password changed successfully. Please register your facial data.') {
        // Hide the change password form and show the facial registration section
        modal.style.display = "none";
        pwdModal.style.display = "none";
        checkResultModal.style.display = "none";
        faceVerifyModal.style.display = "none";
        faceModal.style.display = "flex";
    }
});

// Check Result event
document.getElementById('result-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect semester and level data
    const semester = document.getElementById('semester').value;
    const level = document.getElementById('level').value;

    // Send this data to the backend (likely saving for later use after facial verification)
    const response = await fetch('/api/auth/verifyResult', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semester, level}),
    });

    // Check if the response is OK (status code in the range 200-299)
    if (!response.ok) {
        const errorText = await response.text(); // Get error text
        console.error('Error response:', errorText);
        alert('Error during verification process: ' + response.statusText);
        return;
    } else {
        alert('Result found proceed to confirm facial identity');
    }

    // Parse the JSON response

    const result = await response.json();
    console.log(result)
    if (result.message === 'Proceed to face verification') {
        modal.style.display = "none";
        pwdModal.style.display = "none";
        checkResultModal.style.display = "none";
        faceModal.style.display = "none";
        faceVerifyModal.style.display = "flex";
    } else {
        alert('Error during verification process.');
    }
});
