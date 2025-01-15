if (resultData) {
  const studentInfoElement = document.querySelector('.student-info');
  const tableBodyElement = document.querySelector('table tbody');
  const totalSummaryElement = document.querySelector('.total-summary');

  studentInfoElement.innerHTML = `
    <p><strong>FULL NAME:</strong> ${resultData.studentName}</p>
    <p><strong>REG. NO:</strong> ${resultData.regNo}</p>
    <p><strong>DEPARTMENT:</strong> ${resultData.department}</p>
    <p><strong>LEVEL:</strong> ${resultData.level}</p>
    <p><strong>SEMESTER:</strong> ${resultData.semester}</p>
  `;

  tableBodyElement.innerHTML = '';
  resultData.courses.forEach(course => {
    const row = `
      <tr>
        <td>${course.code}</td>
        <td>${course.title}</td>
        <td>${course.creditUnits}</td>
        <td>${course.grade}</td>
      </tr>
    `;
    tableBodyElement.insertAdjacentHTML('beforeend', row);
  });

  totalSummaryElement.innerHTML = `
    <p>Total Unit = ${resultData.totalUnits} | GPA = ${resultData.gpa}</p>
  `;
} else {
  alert('No result data found.');
}
