function showForm(role) {
    const form = document.getElementById('loginForm');
    const roleInput = document.getElementById('role');
    const buttons = document.querySelectorAll('.button-group button');
    
    form.classList.remove('hidden');
    roleInput.value = role;

    buttons.forEach(button => {
        button.classList.remove('active'); // Remove active class from all buttons
    });

    // Add the active class to the clicked button
    document.querySelector(`.button-group button[onclick="showForm('${role}')"]`).classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const boxContainer = document.getElementById('boxContainer');
    const empContainer = document.getElementById('empContainer');
    const assignTaskButton = document.getElementById('assignTaskButton');
    const filterSection = document.getElementById('filter-section');

    if (role === 'boss' && username === 'admin' && password === 'admin123') {
        // Boss login
        document.getElementById('loginContainer').classList.add('hidden');
        boxContainer.style.display = "block";
        assignTaskButton.style.display = "block"; // Show for boss
        filterSection.style.display = "block"; // Show for boss
    } else if (role === 'employee' && username === 'employee' && password === 'emp123') {
        // Employee login
        document.getElementById('loginContainer').classList.add('hidden');
        empContainer.style.display = "block";
    } else {
        alert('Invalid credentials');
    }
}


function logout() {
    const loginForm = document.getElementById('loginForm');
    loginForm.reset()
    // Hide the task container and show the login container
    document.getElementById('boxContainer').style.display = "none";
    document.getElementById('empContainer').style.display = "none";
    document.getElementById('loginContainer').classList.remove('hidden');
}


// /////////////////////////////////////////////////
function assignTask() {
    closeAllModals();
    const modal = document.getElementById('assignTaskModal');
        document.getElementById('assignTaskForm').reset();

    editRow = null;

    modal.style.display = "flex";
}


function closeModal() {
    // Hide the modal
    const modal = document.getElementById('assignTaskModal');
    modal.style.display = "none";
    editRow = null;
}

function closeAllModals() {
    document.getElementById('assignTaskModal').style.display = "none";
    document.getElementById('detailTaskModal').style.display = "none";
}

let taskCounter = 0; // Counter to track task numbers
let editRow = null; // To track the task row being edited

function submitTask(event) {
    event.preventDefault();


    const taskName = document.getElementById('taskName').value.trim();
    const description = document.getElementById('description').value.trim();
    const assignedTo = document.getElementById('assignedTo').value.trim();
    const duration = document.getElementById('duration').value.trim();
    const timeRange = document.getElementById('timeRange').value.trim();
    const priority = document.getElementById('priority').value.trim();
    const dueDate = document.getElementById('dueDate').value.trim();

    // Validate the form fields
    if (!taskName || !description || !assignedTo || !duration || !timeRange || !priority || !dueDate) {
        alert('Please fill out all fields.');
        return;
    }

    const startTime = new Date().toLocaleString();

    // If editing a task, update the existing row
    if (editRow) {
        
        // Update the task details in the visible table
        editRow.children[1].textContent = taskName;
        editRow.children[2].textContent = assignedTo;
        editRow.children[3].textContent = startTime;
        editRow.children[4].textContent = dueDate;
        editRow.children[5].textContent = "Pending";

        // Find the corresponding row in the employee's task table and update it
        const empRows = document.querySelectorAll('#empContainer #taskTable tbody tr');
        empRows.forEach(empRow => {
            if (empRow.children[0].textContent === editRow.children[0].textContent) {
                empRow.children[1].textContent = taskName;
                empRow.children[2].textContent = assignedTo;
                empRow.children[3].textContent = startTime;
                empRow.children[4].textContent = dueDate;
            }
        });

        // Retrieve data from the invisible table and update the hidden fields
        const hiddenRow = document.querySelector(`#invisibleTable tbody tr:nth-child(${editRow.children[0].textContent})`);
        hiddenRow.children[1].textContent = description;
        hiddenRow.children[2].textContent = duration;
        hiddenRow.children[3].textContent = timeRange;
        hiddenRow.children[4].textContent = priority;
        hiddenRow.children[5].textContent = dueDate;

        // Reset editRow to null after editing
        editRow = null;
    } else {
        // If adding a new task, add a new row in the visible table
        taskCounter++;
        const taskTableBody = document.querySelector('#taskTable tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${taskCounter}</td>
            <td>${taskName}</td>
            <td>${assignedTo}</td>
            <td>${startTime}</td>
            <td>${dueDate}</td>
            <td>Pending</td>
            <td>
                <button style="border: none; font-size: larger; background: transparent;" onclick="editTask(this)"><i class="fa-solid fa-pen-to-square" style="color: green; "></i></button>
                <button style="border: none; font-size: larger; background: transparent;" onclick="showTaskDetails(this)"><i class="fa-regular fa-circle-question" style="color: #FFD43B;"></i></button>
                <button style="border: none; font-size: larger; background: transparent;" onclick="deleteTask(this)"><i class="fa-solid fa-delete-left" style="color: red; "></i></button>
            </td>
        `;
        taskTableBody.appendChild(newRow);

        // Add the extra data to the invisible table
        const invisibleTableBody = document.querySelector('#invisibleTable tbody');
        const hiddenRow = document.createElement('tr');
        hiddenRow.innerHTML = `
            <td>${taskName}</td>
            <td>${description}</td>
            <td>${duration}</td>
            <td>${timeRange}</td>
            <td>${priority}</td>
            <td>${dueDate}</td>
        `;
        invisibleTableBody.appendChild(hiddenRow);

        // Now, add the task to the employee's container (empContainer)
        const empTaskTableBody = document.querySelector('#empContainer #taskTable tbody');
        const empNewRow = document.createElement('tr');
        empNewRow.innerHTML = `
               <td>${taskCounter}</td>
    <td>${taskName}</td>
    <td>${assignedTo}</td>
    <td>${startTime}</td>
    <td>${dueDate}</td>
    <td>
        <select onchange="changeStatus(this)" style = "border-radius: 32px; background-color: yellow; font-size: larger; font-weight: bolder;">
            <option value="Pending" selected>Pending</option>
            <option value="In Progress" style="background: yellow;">In Progress</option>
            <option value="Completed">Completed</option>
        </select>
    </td>
    <td>
        <button style="border: none; font-size: larger; background: transparent;" onclick="showTaskDetails(this)">
            <i class="fa-regular fa-circle-question" style="color: #FFD43B;"></i>
        </button>
    </td>
`;
        empTaskTableBody.appendChild(empNewRow);
    }

    closeModal();
    document.getElementById('assignTaskForm').reset(); // Clear the form
}

function editTask(button) {
    closeAllModals();
    // Get the row of the task being edited
    editRow = button.closest('tr');

    // Populate the form in the modal with task details from the visible table
    document.getElementById('taskName').value = editRow.children[1].textContent;
    document.getElementById('assignedTo').value = editRow.children[2].textContent;

    // Retrieve additional data from the invisible table
    const hiddenRow = document.querySelector(`#invisibleTable tbody tr:nth-child(${editRow.children[0].textContent})`);
    document.getElementById('description').value = hiddenRow.children[1].textContent;
    document.getElementById('duration').value = hiddenRow.children[2].textContent;
    document.getElementById('timeRange').value = hiddenRow.children[3].textContent; 
    document.getElementById('priority').value = hiddenRow.children[4].textContent;  
    document.getElementById('dueDate').value = hiddenRow.children[5].textContent;  

    document.getElementById('assignTaskModal').style.display = "flex";
}


function deleteTask(button) {
    const row = button.closest('tr');
    const taskId = row.children[0].textContent; 
    row.remove(); 

    // Find the corresponding row in the employee's dashboard by Task ID
    const empRows = document.querySelectorAll('#empContainer #taskTable tbody tr');
    empRows.forEach(empRow => {
        if (empRow.children[0].textContent === taskId) {
            empRow.remove(); 
        }
    });


    const bossRows = document.querySelectorAll('#taskTable tbody tr');
    const empRowsUpdated = document.querySelectorAll('#empContainer #taskTable tbody tr');
    bossRows.forEach((row, index) => (row.children[0].textContent = index + 1));
    empRowsUpdated.forEach((row, index) => (row.children[0].textContent = index + 1));


    taskCounter = bossRows.length;
}






// Function to show the details of the selected task
function showTaskDetails(button) {
    closeAllModals();
    const row = button.closest('tr');
    const taskNumber = row.children[0].textContent;

    // Locate the corresponding hidden row in the invisible table
    const hiddenRow = document.querySelector(`#invisibleTable tbody tr:nth-child(${taskNumber})`);

    if (hiddenRow) {
        // Populate the details modal with data from both visible and hidden rows
        document.getElementById('detailTaskName').innerHTML = `<strong>Task Name:</strong>  ${row.children[1].textContent}`;
        document.getElementById('detailDescription').innerHTML = `<strong>Description:</strong> ${hiddenRow.children[1].textContent}`;
        document.getElementById('detailAssignedTo').innerHTML = `<strong>Assigned To:</strong> ${row.children[2].textContent}`;
        document.getElementById('detailDuration').innerHTML = `<strong>Planned Duration:</strong> ${hiddenRow.children[2].textContent}`;
        document.getElementById('detailTimeRange').innerHTML = `<strong>Time Range:</strong> ${hiddenRow.children[3].textContent}`;
        document.getElementById('detailPriority').innerHTML = `<strong>Priority:</strong> ${hiddenRow.children[4].textContent}`;
        document.getElementById('detailDueDate').innerHTML = `<strong>Due Date:</strong> ${hiddenRow.children[5].textContent}`;

    
        document.getElementById('detailTaskModal').style.display = 'flex';
    } else {
        alert('Details not found for this task.');
    }
}


// Function to close the detail modal
function closeDetailModal() {
    document.getElementById('detailTaskModal').style.display = 'none';
}



///////////////filter/////////////////////////

function applyFilter() {
    const priorityFilter = document.getElementById('priorityFilter').value;
    const dueDateFilter = document.getElementById('dueDateFilter').value;

    // Get all rows from the task table and invisible table
    const taskRows = document.querySelectorAll('#taskTable tbody tr');
    const hiddenRows = document.querySelectorAll('#invisibleTable tbody tr');

    // Loop through each row to filter
    taskRows.forEach((row, index) => {
        const taskPriority = hiddenRows[index].children[4].textContent; 
        const taskDueDate = hiddenRows[index].children[5].textContent; 

        let matchPriority = true;
        let matchDueDate = true;

        // Check if the priority matches the filter
        if (priorityFilter && taskPriority !== priorityFilter) {
            matchPriority = false;
        }

        // Check if the due date matches the filter
        if (dueDateFilter && taskDueDate !== dueDateFilter) {
            matchDueDate = false;
        }

        // Show or hide the row based on filter criteria
        if (matchPriority && matchDueDate) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to change task status (for employee only)
function changeStatus(dropdown) {
    const row = dropdown.closest('tr');
    const newStatus = dropdown.value; 
    const taskId = row.children[0].textContent; 

    // Update the status in the boss's dashboard
    const bossRows = document.querySelectorAll('#taskTable tbody tr');
    bossRows.forEach(bossRow => {
        if (bossRow.children[0].textContent === taskId) {
            bossRow.children[5].textContent = newStatus; 
        }
    });

    // Ensure the dropdown remains visible in the employee dashboard
    const dropdownCell = row.children[5];
    dropdownCell.innerHTML = `
        <select onchange="changeStatus(this)" style="border-radius: 32px; background-color: yellow; font-size: larger; font-weight: bolder;">
            <option value="Pending" ${newStatus === "Pending" ? "selected" : ""}>Pending</option>
            <option value="In Progress" ${newStatus === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${newStatus === "Completed" ? "selected" : ""}>Completed</option>
        </select>
    `;
}

