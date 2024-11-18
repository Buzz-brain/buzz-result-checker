// Preview uploaded file
async function previewFile() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    if (!file) {
        showNotification('Please select a file to preview.', 'error');
        return;
    }

    // Preview file content (assuming an Excel file for simplicity)
    try {
        const data = await readExcelFile(file);
        displayPreview(data);
        showNotification('Preview loaded successfully.', 'success');
    } catch (error) {
        showNotification('Error loading file preview.', 'error');
    }
}

// Read Excel file function (mockup, replace with actual Excel file processing)
async function readExcelFile(file) {
    return [
        ["Reg. No", "Course Code", "Grade"],
        ["20191180000", "CSC 301", "A"],
        ["20191180001", "CSC 302", "B"]
    ];
}

// Display preview data
function displayPreview(data) {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '<h3>File Preview:</h3>';
    const table = document.createElement('table');
    data.forEach(row => {
        const rowElement = document.createElement('tr');
        row.forEach(cell => {
            const cellElement = document.createElement('td');
            cellElement.textContent = cell;
            rowElement.appendChild(cellElement);
        });
        table.appendChild(rowElement);
    });
    previewContainer.appendChild(table);
}

// Confirm upload with duplicate and format validation
function confirmUpload() {
    const fileInput = document.getElementById('fileUpload');
    if (!fileInput.files[0]) {
        showNotification('No file selected for upload.', 'error');
        return;
    }

    const data = getFileDataFromPreview();
    if (!isFileValid(data)) {
        showNotification('File format or data invalid.', 'error');
        return;
    }

    // Proceed with upload
    uploadResults(data);
}

// Validate file data
function isFileValid(data) {
    const headers = data[0];
    if (headers[0] !== "Reg. No" || headers[1] !== "Course Code" || headers[2] !== "Grade") {
        return false;
    }
    // Check for duplicate entries if needed
    return true;
}

// Upload results (mock function)
function uploadResults(data) {
    // Simulate successful upload
    showNotification('Results uploaded successfully!', 'success');
}

// Export results to download
function downloadResults() {
    showNotification('Results downloaded.', 'success');
    // Actual file download logic goes here
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.appendChild(notification);

    setTimeout(() => {
        notificationsContainer.removeChild(notification);
    }, 3000);
}

// Helper function to fetch preview data for upload (mockup)
function getFileDataFromPreview() {
    return [
        ["20191180000", "CSC 301", "A"],
        ["20191180001", "CSC 302", "B"]
    ];
}


/// Sample data for courses and results (replace with real backend data fetching in a production app)
const courses = {
    "100": ["MAT 101", "PHY 101", "CSC 101"],
    "200": ["MAT 201", "PHY 201", "CSC 201"],
    // Add other levels and courses as needed
};

const resultsData = [
    { regNo: "20191180000", courseCode: "CSC 101", grade: "A", semester: 1, level: 100 },
    { regNo: "20191180001", courseCode: "PHY 101", grade: "B", semester: 1, level: 100 },
    // Additional sample results
];

// Populate courses dropdown based on selected level
document.getElementById('level').addEventListener('change', function() {
    const level = this.value;
    const courseSelect = document.getElementById('course');
    courseSelect.innerHTML = ''; // Clear existing options

    if (courses[level]) {
        courses[level].forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            courseSelect.appendChild(option);
        });
    }
});

// Load and display results based on selection
function loadSelectedResults() {
    const semester = parseInt(document.getElementById('semester').value);
    const level = parseInt(document.getElementById('level').value);
    const course = document.getElementById('course').value;

    const resultsTableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
    resultsTableBody.innerHTML = ''; // Clear existing rows

    const filteredResults = resultsData.filter(result => 
        result.semester === semester && result.level === level && result.courseCode === course
    );

    if (filteredResults.length === 0) {
        resultsTableBody.innerHTML = '<tr><td colspan="4">No results found for the selected criteria.</td></tr>';
        return;
    }

    filteredResults.forEach((result, index) => {
        const row = resultsTableBody.insertRow();
        row.innerHTML = `
            <td>${result.regNo}</td>
            <td>${result.courseCode}</td>
            <td contenteditable="true">${result.grade}</td>
            <td>
                <button onclick="editResult(${index})" class="edit-btn">Edit</button>
                <button onclick="deleteResult(${index})" class="delete-btn">Delete</button>
            </td>
        `;
    });
}

// Edit and Delete functions (same as before, updated to reference filtered results data)
function editResult(index) {
    const gradeCell = document.querySelectorAll('#resultsTable tbody tr')[index].cells[2];
    const updatedGrade = gradeCell.textContent;

    resultsData[index].grade = updatedGrade;
    showNotification(`Result for ${resultsData[index].courseCode} updated.`, 'success');
}

function deleteResult(index) {
    if (confirm('Are you sure you want to delete this result?')) {
        resultsData.splice(index, 1); // Remove result from data array
        loadSelectedResults(); // Reload the table
        showNotification('Result deleted successfully.', 'success');
    }
}
