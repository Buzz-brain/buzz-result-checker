// Preregister student form submission
const preregisterForm = document.getElementById('preregister-form');

preregisterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const surname = document.getElementById('surname').value;
    const firstname = document.getElementById('firstname').value;
    const regNo = document.getElementById('regNo').value;
    const currentLevel = document.getElementById('currentLevel').value;
    const sex = document.getElementById('sex').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/preregister', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ surname, firstname, regNo, currentLevel, sex, password }),
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error(error);
    }
});

// Get student data
async function getStudentData() {
    try {
        const response = await fetch('/api/auth/students');
        const students = await response.json();
        const tableBody = document.getElementById('student-data-table-body');
        tableBody.innerHTML = '';

        students.forEach((student) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                            <td>${student.regNo}</td>
                            <td>${student.surname}</td>
                            <td>${student.firstname}</td>
                            <td>${student.currentLevel}</td>
                            <td>${student.sex}</td>
                            <td>${student.hasFacialData}</td>
                            <td>${student.passwordChanged}</td>
                        `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}


// Call the getStudentData function when the page loads
document.addEventListener('DOMContentLoaded', getStudentData);

// Get the select form elements
const levelSelect = document.getElementById('level');
const courseCodeSelect = document.getElementById('course-code');
const semesterSelect = document.getElementById('semester');

// Get the file upload form elements
const fileUploadInput = document.getElementById('file-upload');
const uploadButton = document.getElementById('upload-button');

// Add event listener to the level select element
levelSelect.addEventListener('change', async (e) => {
    const selectedLevel = e.target.value;
    // Populate the course code select element with courses for the selected level
    const courses = await getCoursesForLevel(selectedLevel);
    courseCodeSelect.innerHTML = '';
    courses.forEach((course) => {
        const option = document.createElement('option');
        option.value = course.code;
        option.textContent = course.title;
        courseCodeSelect.appendChild(option);
    });
});

// Add event listener to the upload button
uploadButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const selectedLevel = levelSelect.value;
    const selectedCourseCode = courseCodeSelect.value;
    const selectedSemester = semesterSelect.value;
    const uploadedFile = fileUploadInput.files[0];

    if (!uploadedFile) {
        alert('Please select a file to upload.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('level', selectedLevel);
        formData.append('courseCode', selectedCourseCode);
        formData.append('semester', selectedSemester);

        const response = await fetch('/api/upload-results', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        alert('Results uploaded successfully!');
        // Display a preview of the result
        const previewContainer = document.getElementById('preview-container');
        previewContainer.innerHTML = '';

        const table = document.createElement('table');
        table.innerHTML = `
                            <tr>
                            <th>Reg. No.</th>
                            <th>Grade</th>
                            <th>Credit Unit</th>
                            </tr>
                            `;

        result.data.forEach((row) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                            <td>${row.regNo}</td>
                            <td>${row.grade}</td>
                            <td>${row.creditUnit}</td>
                            `;
            table.appendChild(tr);
        });

        previewContainer.appendChild(table);
    } catch (error) {
        alert('Error uploading results.');
    }
});


// Helper function to get courses for a level
async function getCoursesForLevel(level) {
    const response = await fetch(`/api/courses/level/${level}`);
    return response.json();
}