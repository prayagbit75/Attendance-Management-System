const API_BASE_URL = "http://localhost:5000/api"; 

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("teacherRegisterForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            // const subject = document.getElementById("subject").value;

            const response = await fetch(`${API_BASE_URL}/teachers/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password})
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) window.location.href = "teacherLogin.html";
        });
    }
});



     // Teacher Login
     document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("teacherLoginForm"); //  Corrected ID
    
        if (!loginForm) {
            console.error(" teacherLoginForm not found! Check your HTML file.");
            return;  //  Stop execution if form is missing
        }
    
        async function loginTeacher(event) {
            event.preventDefault();
        
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
        
            try {
                const response = await fetch("http://localhost:5000/api/teachers/login", {  
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await response.json();
                console.log(" API Response:", data);
    
                if (!response.ok) {
                    throw new Error(data.message || "Login failed");
                }
    
                //  Save token & teacherId
                localStorage.setItem("token", data.token);
                localStorage.setItem("teacherId", data.teacherId);  
    
                console.log("🔹 Stored teacherId:", localStorage.getItem("teacherId"));
                console.log("🔹 Stored token:", localStorage.getItem("token"));
    
                window.location.href = "teacherDashboard.html";  //  Redirect
            } catch (error) {
                console.error(" Error logging in:", error);
                alert(error.message);
            }
        }
    
        loginForm.addEventListener("submit", loginTeacher);
    });
    
    

    // Student Login
    const studentLoginForm = document.getElementById("studentLoginForm");
    if (studentLoginForm) {
        studentLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch(`${API_BASE_URL}/students/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("studentId", data.studentId);
                window.location.href = "studentDashboard.html";
            } else {
                alert(data.message);
            }
        });
    }

