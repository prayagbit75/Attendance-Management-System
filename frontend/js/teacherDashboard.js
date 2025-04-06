const API_BASE_URL = "http://localhost:5000/api"; // Ensure this is correct



const token = localStorage.getItem("token");
if (!token) {
    alert("Unauthorized! Please login again.");
    window.location.href = "teacherLogin.html";  // Redirect to login
}

async function fetchStudents() {
    try {
        const teacherId = localStorage.getItem("teacherId"); 
        const token = localStorage.getItem("token");

        if (!teacherId || !token) {
            console.warn(" Missing teacherId or token!");
            alert("Unauthorized! Please login again.");
            window.location.href = "teacherLogin.html";
            return;
        }

        console.log(" Fetching students for teacher:", teacherId);

        const response = await fetch(`${API_BASE_URL}/students/teacher/${teacherId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch students");
        }

        const students = await response.json(); // API returns array

        const studentTable = document.getElementById("studentTable").getElementsByTagName("tbody")[0];
        studentTable.innerHTML = "";

        if (students.length === 0) {
            studentTable.innerHTML = `<tr><td colspan="4">No students found</td></tr>`;
            return;
        }    

        //  Single Date Input for All Students
        document.getElementById("attendanceDate").addEventListener("change", function() {
            let selectedDate = this.value;
            document.querySelectorAll(".student-date").forEach(input => {
                input.value = selectedDate;
            });
        });

        students.forEach(student => {
            let row = studentTable.insertRow();
            row.insertCell(0).innerText = student.name; 
            row.insertCell(1).innerText = student.email;

            //  Add Hidden Date Picker (auto-updated)
            let dateInput = document.createElement("input");
            dateInput.type = "date";
            dateInput.classList.add("student-date");
            dateInput.value = document.getElementById("attendanceDate").value;
            row.insertCell(2).appendChild(dateInput);

            //  Add Present/Absent Buttons
            let actionCell = row.insertCell(3);
            actionCell.innerHTML = ` 
                <button onclick="markAttendance('${student._id}', 'Present')" class="gradient-btn">Present</button>
                <button onclick="markAttendance('${student._id}', 'Absent')" class="gradient-btn">Absent</button>
            `;
        });

    } catch (error) {
        console.error(" Error fetching students:", error);
    }
}

//  Fix Attendance API Call (Check API URL)
async function markAttendance(student, status) {
    const date = document.getElementById("attendanceDate").value;  
    if (!date) {
        alert("Please select a date.");
        return;
    }



    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/attendance/mark`, {  
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        
            body: JSON.stringify({ student, date, status })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to mark attendance");
        }

        alert(`Attendance marked: ${status}`);
        console.log(" Attendance Marked:", data);
    } catch (error) {
        console.error(" Error marking attendance:", error);
        alert("Error marking attendance. Try again.");
    }
}

//  Ensure fetchStudents runs when the page loads
document.addEventListener("DOMContentLoaded", fetchStudents);

//  Add Student
async function addStudent() {
    const name = document.getElementById("studentName").value;  
    const email = document.getElementById("studentEmail").value;  
    const subject = document.getElementById("studentSubject").value;  
    const password = document.getElementById("studentPassword").value; 
    const phone = document.getElementById("parentPhone").value; 
    
    const teacherId = localStorage.getItem("teacherId"); 
    const token = localStorage.getItem("token");



    if (!teacherId || !token) {
        console.warn(" Missing teacherId or token!");
        alert("Unauthorized! Please login again.");
        window.location.href = "teacherLogin.html";
        return;
    }
    
    console.log("code working fine till here")
    console.log(teacherId);

    if (!name || !email || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/students/add`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password,subject, teacherId, phone})
        });

        const data = await response.json();
        if (response.ok) {
            alert("Student added successfully!");
            fetchStudents(); // Refresh student list
        } else {
            alert(data.message || "Failed to add student");
        }
    } catch (error) {
        console.error("Error adding student:", error);
    }
}

//  Logout
function logout() {
    localStorage.clear();
    window.location.href = "teacherLogin.html";
}

//  Initial Fetch Students
fetchStudents();
