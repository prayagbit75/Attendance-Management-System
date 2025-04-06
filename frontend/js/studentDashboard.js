// const studentId = localStorage.getItem("studentId");
// if (!studentId) window.location.href = "studentLogin.html";

// async function fetchAttendance() {
//     const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`);
//     const data = await response.json();
//     document.getElementById("attendance").innerText = 
//         `Total Classes: ${data.totalClasses}, Present: ${data.presentClasses}, Attendance: ${data.attendancePercentage}%`;
// }

function logout() {
    localStorage.clear();
    window.location.href = "studentLogin.html";
}

const API_BASE_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const studentId = localStorage.getItem("studentId");

if (!token || !studentId) {
    alert("Unauthorized! Please login again.");
    window.location.href = "studentLogin.html";  // Redirect to login
}

async function fetchStudentDetails() {
    console.log("heres the mf id::::")
    console.log(studentId);
    try {
        const response = await fetch(`${API_BASE_URL}/students/student/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("yooo Failed to fetch student details");
        }

        const data = await response.json();
        console.log("✅ Student Details:", data);
        document.getElementById("studentName").innerText = `Name: ${data.name || "N/A"}`;
        document.getElementById("studentEmail").innerText = `Email: ${data.email || "N/A"}`;
        document.getElementById("parentPhone").innerText = `Parent Phone: ${data.phone || "N/A"}`;
    } catch (error) {
        console.error("❌ Error fetching student details:", error);
        alert("Error fetching data. Please try again.");
    }
}

// ✅ Fetch Student Attendance Details
async function fetchAttendanceDetails() {
    try {
        const response = await fetch(`${API_BASE_URL}/attendance/${studentId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch attendance details");
        }

        const data = await response.json();
        console.log("✅ Student Attendance Data:", data);

        // document.getElementById("subject").innerText = `Total Classes: ${data.subject}`;                   //new
        document.getElementById("totalClasses").innerText = `Total Classes: ${data.totalClasses}`;
        document.getElementById("presentClasses").innerText = `Present Classes: ${data.presentClasses}`;
        document.getElementById("attendancePercentage").innerText = `Attendance: ${data.attendancePercentage}%`;

        // ✅ Show Warning if Attendance is Below 75%
        const warningDiv = document.getElementById("warningMessage");
        if (data.attendancePercentage < 75) {
            warningDiv.innerHTML = `<p style="color: red;">⚠️ Warning: Your attendance is below 75%.</p>
                                    <p><strong>${data.message}</strong></p>`;
        } else {
            warningDiv.innerHTML = `<p style="color: green;">✅ Your attendance is good!</p>`;
        }

    } catch (error) {
        console.error("❌ Error fetching attendance details:", error);
        alert("Error fetching data. Please try again.");
    }
}

// ✅ Ensure Fetch Runs on Page Load
document.addEventListener("DOMContentLoaded", fetchStudentDetails);
document.addEventListener("DOMContentLoaded", fetchAttendanceDetails);
