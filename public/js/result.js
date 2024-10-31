document.addEventListener('DOMContentLoaded', async () => {
    const regNo = '20191180000'; // Replace with dynamic value if needed
    try {
      const response = await fetch(`/results/${regNo}`);
      if (!response.ok) throw new Error('Failed to fetch results');
      
      const data = await response.json();
      document.querySelector('.student-info').innerHTML = `
        <p><strong>FULL NAME:</strong> ${data.fullName}</p>
        <p><strong>REG. NO:</strong> ${data.regNo}</p>
        <p><strong>DEPARTMENT:</strong> ${data.department}</p>
        <p><strong>LEVEL:</strong> ${data.level}</p>
        <p><strong>SEMESTER:</strong> ${data.semester}</p>
      `;
  
      const tableBody = document.querySelector('table tbody');
      tableBody.innerHTML = ''; // Clear any placeholder content
  
      data.courses.forEach(course => {
        const row = `
          <tr>
            <td>${course.code}</td>
            <td>${course.title}</td>
            <td>${course.creditUnits}</td>
            <td>${course.grade}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
      });
  
      document.querySelector('.total-summary').innerHTML = `
        <p>Total Unit = ${data.totalUnits} | GPA = ${data.gpa}</p>
      `;
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching results. Please try again later.');
    }
  });
  