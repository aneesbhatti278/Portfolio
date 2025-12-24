/*
Employee Management System
Frontend Project
Developed using HTML, CSS, JavaScript
*/

// Employee Data Storage
let employees = JSON.parse(localStorage.getItem("employees")) || [];
localStorage.clear();

// Default demo credentials
const users = {
    admin: { username: "admin", password: "admin123" },
    employee: { username: "employee", password: "emp123" }
};

// Login Handler
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const role = role.value;
    const user = username.value;
    const pass = password.value;

    if (role === "admin" &&
    user === users.admin.username &&
    pass === users.admin.password) {
    localStorage.setItem("loggedInRole", "admin");
    localStorage.setItem("loggedInUser", user);
    initializeApp();
    }
    else {
    const emp = employees.find(e => e.username === user);
    if (emp && pass === "emp123") {
        localStorage.setItem("loggedInRole", "employee");
        localStorage.setItem("loggedInUser", user);
        initializeApp();
    } else {
        loginError.innerText = "Invalid credentials";
    }
}
});

// Toggle Password Visibility
function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = pwd.type === "password" ? "text" : "password";
}

// Open Forgot Password Modal
function openForgotModal() {
    document.getElementById("forgotModal").style.display = "block";
}

// Close Forgot Password Modal
function closeForgotModal() {
    document.getElementById("forgotModal").style.display = "none";
    document.getElementById("forgotMsg").innerText = "";
}

// Forgot Password Handler
function forgotPassword() {
    const role = document.getElementById("forgotRole").value;
    const username = document.getElementById("forgotUsername").value;
    const msg = document.getElementById("forgotMsg");

    if (!role || !username) {
        msg.style.color = "red";
        msg.innerText = "Please fill all fields";
        return;
    }

    if (
        (role === "admin" && username === "admin") ||
        (role === "employee" && employees.some(e => e.username === username))
    ) {
        msg.style.color = "green";
        msg.innerText = 
            "Demo Mode: Password reset link sent to registered email.";
    } else {
        msg.style.color = "red";
        msg.innerText = "User not found";
    }
}

// Initialize App
function initializeApp() {
    const role = localStorage.getItem("loggedInRole");

    startSessionTimer();

    document.getElementById("loginSection").style.display = "none";
    document.querySelector(".navbar").style.display = "flex";

    // Employee role restrictions
    if (role === "employee") {
        document.getElementById("add").style.display = "none";
        document.getElementById("dashboard").style.display = "none";

        document.querySelectorAll("button").forEach(btn => {
            if (btn.innerText === "Edit" || btn.innerText === "Delete") {
                btn.style.display = "none";
            }
        });
    }
}

// Logout
function logout() {
    localStorage.removeItem("loggedInRole");
    location.reload();

    const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
    let logoutTimer;
}

// Start Session Timer
function startSessionTimer() {
    clearTimeout(logoutTimer);

    logoutTimer = setTimeout(() => {
        alert("Session expired. Please login again.");
        logout();
    }, SESSION_TIMEOUT);
}

// Reset timer on user activity
["click", "mousemove", "keypress"].forEach(event => {
    document.addEventListener(event, startSessionTimer);
});


// Add Employee
document.getElementById("employeeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let employee = {
    id: Date.now(),
    name: name.value,
    department: department.value,
    designation: designation.value,
    email: email.value,
    phone: phone.value,
    joiningDate: joiningDate.value,
    username: empUsername.value,
    attendance: "Absent"
};


    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));
    this.reset();
    displayEmployees();
});

// Display Employees
function displayEmployees() {
    let table = document.getElementById("employeeTable");
    table.innerHTML = "";

    let currentPage = 1;
    const rowsPerPage = 5;
    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let paginatedEmployees = employees.slice(start, end);

    const role = localStorage.getItem("loggedInRole");
    const loggedUser = localStorage.getItem("loggedInUser");

    let visibleEmployees =
        role === "employee"
            ? employees.filter(e => e.username === loggedUser)
            : employees;

    paginatedEmployees.forEach(emp => {
        table.innerHTML += `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.designation}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>
                <button onclick="openEditModal(${emp.id})">Edit</button>
                <button onclick="openDeleteModal(${emp.id})">Delete</button>
            </td>
        </tr>`;
    });

    updatePagination();
    updateDashboard();
}

// Delete Employee
function deleteEmployee(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem("employees", JSON.stringify(employees));
        displayEmployees();
    }
}

// Open Edit Modal
function openEditModal(id) {
    const emp = employees.find(e => e.id === id);

    editId.value = emp.id;
    editName.value = emp.name;
    editDepartment.value = emp.department;
    editDesignation.value = emp.designation;
    editEmail.value = emp.email;
    editPhone.value = emp.phone;

    document.getElementById("editModal").style.display = "block";
}

// Open Delete Modal
function openDeleteModal(id) {
    deleteId = id;
    document.getElementById("deleteModal").style.display = "block";
}

// Close Delete Modal
function closeDeleteModal() {
    deleteId = null;
    document.getElementById("deleteModal").style.display = "none";
}

// Confirm Delete
function confirmDelete() {
    lastDeletedIndex = employees.findIndex(emp => emp.id === deleteId);
    lastDeletedEmployee = employees[lastDeletedIndex];

    employees.splice(lastDeletedIndex, 1);
    localStorage.setItem("employees", JSON.stringify(employees));

    closeDeleteModal();
    displayEmployees();
    showToast("Employee deleted", true);
}
// Undo Delete
function undoDelete() {
    if (lastDeletedEmployee !== null) {
        employees.splice(lastDeletedIndex, 0, lastDeletedEmployee);
        localStorage.setItem("employees", JSON.stringify(employees));
        displayEmployees();
        showToast("Delete undone", false);
        lastDeletedEmployee = null;
    }
}

// Close Modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// Update Employee
document.getElementById("editEmployeeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let lastDeletedEmployee = null;
    let lastDeletedIndex = null;
    let deleteId = null;
    let id = Number(editId.value);
    let emp = employees.find(e => e.id === id);

    emp.name = editName.value;
    emp.department = editDepartment.value;
    emp.designation = editDesignation.value;
    emp.email = editEmail.value;
    emp.phone = editPhone.value;

    localStorage.setItem("employees", JSON.stringify(employees));
    closeModal();
    displayEmployees();
});

// Attendance
function displayAttendance() {
    const role = localStorage.getItem("loggedInRole");
    const loggedInUser = localStorage.getItem("loggedInUser");
    let table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    employees.forEach(emp => {
        if (role === "employee" && emp.username !== loggedInUser) return;

        table.innerHTML += `
        <tr>
            <td>${emp.name}</td>
            <td>
                ${
                    role === "admin"
                    ? `<select onchange="markAttendance(${emp.id}, this.value)">
                        <option ${emp.attendance === "Absent" ? "selected" : ""}>Absent</option>
                        <option ${emp.attendance === "Present" ? "selected" : ""}>Present</option>
                    </select>`
                    : emp.attendance
                }
            </td>
        </tr>`;
    });
}

// Mark Attendance
function markAttendance(id, status) {
    let emp = employees.find(e => e.id === id);
    emp.attendance = status;
    localStorage.setItem("employees", JSON.stringify(employees));
    updateDashboard();
}

// Toast Notification
function showToast(message, undo = false) {
    const toast = document.getElementById("toast");
    const msg = document.getElementById("toastMessage");
    const undoBtn = document.getElementById("undoBtn");

    msg.innerText = message;
    undoBtn.style.display = undo ? "inline-block" : "none";

    toast.style.display = "flex";

    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);

    showToast("Employee added successfully");
    showToast("Employee updated successfully");
}

// Pagination
function updatePagination() {
    pageInfo.innerText = `Page ${currentPage} of ${Math.ceil(employees.length / rowsPerPage)}`;
}

// Next Page
function nextPage() {
    if (currentPage < Math.ceil(employees.length / rowsPerPage)) {
        currentPage++;
        displayEmployees();
    }
}

// Previous Page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayEmployees();
    }
}

// Dashboard Update
function updateDashboard() {
    totalEmployees.innerText = employees.length;
    totalDepartments.innerText = new Set(employees.map(e => e.department)).size;
    attendanceCount.innerText = employees.filter(e => e.attendance === "Present").length;
}

// Search
document.getElementById("search").addEventListener("keyup", function() {
    let value = this.value.toLowerCase();
    document.querySelectorAll("#employeeTable tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// Initial Load
displayEmployees();

// Check Login Status
if (localStorage.getItem("loggedInRole")) {
    initializeApp();
} else {
    document.querySelector(".navbar").style.display = "none";
}
