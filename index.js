// ── Phase 2: Enhanced Task Organisation ──────────────────────────────────────

// Temporary subtask list while filling the form
let formSubtasks = [];

// Add a subtask entry to the form's subtask list
function addSubtaskToForm() {
  const input = document.getElementById("subtaskInput");
  const text = input.value.trim();
  if (!text) return;
  formSubtasks.push({ text, completed: false });
  renderFormSubtasks();
  input.value = "";
}

// Render subtask chips inside the form
function renderFormSubtasks() {
  const ul = document.getElementById("subtaskFormList");
  ul.innerHTML = "";
  formSubtasks.forEach((st, i) => {
    const li = document.createElement("li");
    li.className = "subtask-form-item";
    li.innerHTML = `<span>${st.text}</span>
      <button type="button" class="btn-close-subtask" onclick="removeFormSubtask(${i})">✕</button>`;
    ul.appendChild(li);
  });
}

// Remove a subtask from the form list
function removeFormSubtask(index) {
  formSubtasks.splice(index, 1);
  renderFormSubtasks();
}

// Clear the form subtask list (called after task is added)
function clearFormSubtasks() {
  formSubtasks = [];
  document.getElementById("subtaskFormList").innerHTML = "";
  document.getElementById("subtaskInput").value = "";
}

// Category filter — highlight active button and show/hide tasks
function filterByCategory(category) {
  // Update active button style
  document.querySelectorAll(".cat-filter-btn").forEach(btn => {
    btn.classList.toggle("active-cat", btn.textContent.includes(category) || category === "All" && btn.textContent === "All");
  });
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach(task => {
    const taskCat = task.dataset.category || "Other";
    task.style.display = (category === "All" || taskCat === category) ? "block" : "none";
  });
}

// Toggle a subtask's completed state and save
function toggleSubtask(checkbox, idx) {
  const li = checkbox.closest(".subtask-item");
  if (checkbox.checked) {
    li.classList.add("subtask-done");
  } else {
    li.classList.remove("subtask-done");
  }
  // Check if all subtasks are done — unlock or lock the complete button
  const taskCard = checkbox.closest(".list-group-item");
  const allChecks = taskCard.querySelectorAll(".subtask-check");
  const allDone = Array.from(allChecks).every(c => c.checked);
  const completeBtn = taskCard.querySelector(".complete-btn");
  if (completeBtn) {
    completeBtn.disabled = !allDone;
    completeBtn.title = allDone ? "Mark as complete" : "Complete all subtasks first";
  }
  saveTasksToLocalStorage();
}

// Format date from YYYY-MM-DD to DD-MM-YYYY
function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  const parts = dateStr.trim().split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

// ─────────────────────────────────────────────────────────────────────────────

// Creating instances of document objects
const taskList = document.getElementById("taskList");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const submitBtn = document.getElementById("submitBtn");
const editTaskBtn = document.getElementById("editTask");
const tasksHeading = document.getElementById("heading-tasks");
const searchBar = document.getElementById("searchBar");
const modeToggleBtn = document.getElementById("modeToggle");
const checkboxes = document.querySelectorAll(".form-check-input");
let editItem = null;
const tasksWithPriority = [];
let tasksTitleArray = [];
const priorityColors = {
  High: "task-priority-High",
  Medium: "task-priority-Medium",
  Low: "task-priority-Low",
  Completed: "task-completed",
};

const priorityValues = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// ===== FEATURE 1: USER AUTHENTICATION VARIABLES =====
let isAuthMode = 'login'; // 'login' or 'register'
let currentUser = null;

// Adding Event Listeners to Document Objects [buttons, text fields, dropdown lists]
editTaskBtn.addEventListener("click", (e) => {
  handleEditClick(e);
});
submitBtn.addEventListener("click", (e) => {
  addItem(e);
});
taskList.addEventListener("click", handleItemClick);
modeToggleBtn.addEventListener("click", toggleMode);
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", markAsComplete);
});

flatpickr(dueDateInput, {
  enableTime: false,
  dateFormat: "Y-m-d",
});

//settibng up default theme
function init() {
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", handleSearch);
  
  // ===== FEATURE 1: Check if user is already logged in =====
  const savedUser = sessionStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = savedUser;
    updateAuthUI();
    loadTasksFromLocalStorage();
  } else {
    loadTasksFromLocalStorage();
  }
  tasksCheck();
  
  // ===== FEATURE 2: Subtask input handler =====
  const subtaskInput = document.getElementById('subtask-input');
  if (subtaskInput) {
    subtaskInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addSubtask();
      }
    });
  }
  
  // ===== FEATURE 1: Auth button listeners =====
  document.getElementById('login-btn').addEventListener('click', showAuthModal);
  document.getElementById('register-btn').addEventListener('click', function() {
    isAuthMode = 'register';
    showAuthModal();
  });
  document.getElementById('logout-btn').addEventListener('click', logoutUser);
  document.getElementById('auth-submit-btn').addEventListener('click', handleAuthSubmit);
  document.getElementById('auth-cancel').addEventListener('click', hideAuthModal);
  document.getElementById('auth-toggle-link').addEventListener('click', toggleAuthMode);
  
  // ===== FEATURE 4: Statistics button listener =====
  document.getElementById('statistics-btn').addEventListener('click', showTaskStatistics);
  document.getElementById('statistics-close').addEventListener('click', function() {
    document.getElementById('statistics-panel').style.display = 'none';
  });
}

// ===== FEATURE 1: USER AUTHENTICATION FUNCTIONS =====

function showAuthModal() {
  document.getElementById('auth-modal').style.display = 'flex';
  updateAuthModalUI();
}

function hideAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

function toggleAuthMode(e) {
  e.preventDefault();
  isAuthMode = isAuthMode === 'login' ? 'register' : 'login';
  updateAuthModalUI();
}

function updateAuthModalUI() {
  document.getElementById('auth-title').textContent = isAuthMode === 'login' ? 'Login' : 'Register';
  document.getElementById('auth-submit-btn').textContent = isAuthMode === 'login' ? 'Login' : 'Register';
  document.getElementById('auth-toggle-text').textContent = isAuthMode === 'login' ? "Don't have an account?" : "Already have an account?";
  document.getElementById('auth-toggle-link').textContent = isAuthMode === 'login' ? 'Register' : 'Login';
  document.getElementById('auth-username').value = '';
  document.getElementById('auth-password').value = '';
}

function handleAuthSubmit() {
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value.trim();
  
  if (!username || !password) {
    displayErrorMessage('Please enter both username and password!');
    return;
  }
  
  if (isAuthMode === 'register') {
    registerUser(username, password);
  } else {
    loginUser(username, password);
  }
}

function registerUser(username, password) {
  const users = JSON.parse(localStorage.getItem('todo_users')) || {};
  if (users[username]) {
    displayErrorMessage('Username already exists!');
    return;
  }
  users[username] = { password, tasks: [] };
  localStorage.setItem('todo_users', JSON.stringify(users));
  displaySuccessMessage('Registration successful! Please login.');
  isAuthMode = 'login';
  updateAuthModalUI();
}

function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem('todo_users')) || {};
  if (!users[username] || users[username].password !== password) {
    displayErrorMessage('Invalid username or password!');
    return;
  }
  currentUser = username;
  sessionStorage.setItem('currentUser', username);
  hideAuthModal();
  updateAuthUI();
  loadUserTasks(username);
  displaySuccessMessage('Login successful! Welcome ' + username + '!');
}

function logoutUser() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  updateAuthUI();
  // Clear task list
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  document.getElementById('taskActions').style.display = 'none';
  displaySuccessMessage('Logged out successfully!');
}

function updateAuthUI() {
  const loginBtn = document.getElementById('login-btn');
  const registerBtn = document.getElementById('register-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userDisplay = document.getElementById('user-display');
  
  if (currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userDisplay.style.display = 'inline';
    userDisplay.textContent = '👤 ' + currentUser;
  } else {
    loginBtn.style.display = 'inline-block';
    registerBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userDisplay.style.display = 'none';
  }
}

function loadUserTasks(username) {
  const users = JSON.parse(localStorage.getItem('todo_users')) || {};
  const userTasks = users[username]?.tasks || [];
  localStorage.setItem('tasks', JSON.stringify(userTasks));
  // Reload tasks from localStorage
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }
  loadTasksFromLocalStorage();
}

// Override saveTasksToLocalStorage to also save to user account
function saveTasksToLocalStorage() {
  const tasks = document.querySelectorAll(".list-group-item");
  const tasksArray = extractTasksData(tasks);
  storeTasksInLocalStorage(tasksArray);
  
  // Also save to user account if logged in
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem('todo_users')) || {};
    if (users[currentUser]) {
      users[currentUser].tasks = tasksArray;
      localStorage.setItem('todo_users', JSON.stringify(users));
    }
  }
}

// ===== FEATURE 2: SUBTASK FUNCTIONS =====

function addSubtask() {
  const input = document.getElementById('subtask-input');
  const subtaskText = input.value.trim();
  if (!subtaskText) return;
  
  pendingSubtasks.push(subtaskText);
  input.value = '';
  renderSubtasks();
}

function renderSubtasks() {
  const container = document.getElementById('subtask-list');
  container.innerHTML = '';
  pendingSubtasks.forEach((subtask, index) => {
    const badge = document.createElement('span');
    badge.className = 'badge badge-info';
    badge.style.cssText = 'padding:5px 10px; display:flex; align-items:center; gap:5px;';
    badge.innerHTML = subtask + ' <i class="fas fa-times" style="cursor:pointer; font-size:12px;" data-index="' + index + '"></i>';
    badge.querySelector('i').addEventListener('click', function() {
      pendingSubtasks.splice(parseInt(this.dataset.index), 1);
      renderSubtasks();
    });
    container.appendChild(badge);
  });
}

//search logic
function handleSearch() {
  const searchTerm = searchBar.value.toLowerCase();
  const tasks = document.querySelectorAll(".list-group-item");
  tasks.forEach((task) => {
    const taskTitle = task.childNodes[1].textContent.trim().toLowerCase();
    // ===== FEATURE 2: Enhanced search - also search category and subtasks =====
    const category = task.querySelector("#task-category")?.textContent.toLowerCase() || '';
    const subtasks = task.querySelector("#task-subtasks")?.textContent.toLowerCase() || '';
    
    if (taskTitle.includes(searchTerm) || category.includes(searchTerm) || subtasks.includes(searchTerm)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

//logic to check whether no task is present and hide some buttons
function tasksCheck() {
  const tasks = taskList.children;
  if (tasks.length === 0) {
    tasksHeading.classList.add("hidden");
    searchBar.classList.add("hidden");
    const clearBtn = document.querySelector(".clear_btn");
    const dropdown = document.querySelector(".dropdown");
    const statsBtn = document.getElementById("statistics-btn");
    if (clearBtn) clearBtn.style.display = "none";
    if (dropdown) dropdown.style.display = "none";
    if (statsBtn) statsBtn.style.display = "none";
  }
}

//this gets called after 'edit' button, fills text fields with data to be edited
function handleEditItem(e) {
  e.preventDefault();
  editTaskBtn.style.display = "inline";
  submitBtn.style.display = "none";

  const listItem = e.target.closest(".list-group-item");
  const taskTitle = listItem.childNodes[1].textContent.trim();
  const descEl = listItem.querySelector("#description-at");
  const priorityEl = listItem.querySelector("#task-priority");
  const dueDateEl = listItem.querySelector("#task-dueDate");
  const categoryEl = listItem.querySelector("#task-category");

  document.getElementById("item").value = taskTitle;
  document.getElementById("description").value = descEl
    ? descEl.textContent.replace("Description:", "").trim() : "";
  document.getElementById("priority").value = priorityEl
    ? priorityEl.textContent.trim() : "";
  // Due date displayed as DD-MM-YYYY, flatpickr needs YYYY-MM-DD
  const rawDueText = dueDateEl ? dueDateEl.textContent.replace("📅", "").replace("Due:", "").trim() : "";
  const dueParts = rawDueText.split("-");
  const dueDateForInput = dueParts.length === 3 && dueParts[2].length === 4
    ? `${dueParts[2]}-${dueParts[1]}-${dueParts[0]}`
    : rawDueText;
  document.getElementById("dueDate").value = dueDateForInput;
  document.getElementById("category").value = categoryEl
    ? categoryEl.textContent.trim() : "Other";

  // Load existing subtasks into form
  formSubtasks = [];
  listItem.querySelectorAll(".subtask-item").forEach(st => {
    formSubtasks.push({
      text: st.querySelector("span").textContent,
      completed: st.querySelector(".subtask-check").checked
    });
  });
  renderFormSubtasks();

  document.getElementById("maintitle").innerText = "Edit your tasks below :";
  editItem = e.target;
  document.documentElement.scrollTop = 0;
  document.getElementById("item").focus();
}

function handleEditClick(e) {
  e.preventDefault();
  const itemInput = document.getElementById("item");
  const dueDateInput = document.getElementById("dueDate");
  const descriptionInput = document.getElementById("description");
  const editedItemText = itemInput.value;
  const editedDescriptionText = descriptionInput.value;
  const editedDueDate = new Date(dueDateInput.value);
  const currentDate = new Date().toISOString().split("T")[0];
  const editedPriority = document.getElementById("priority").value;
  const editedCategory = document.getElementById("category").value || "Other";

  if (!editedItemText.trim()) { displayErrorMessage("Task not entered"); return false; }
  if (editedDueDate < new Date(currentDate)) { displayErrorMessage("Due date has already passed !!!"); return false; }
  if (!editedPriority) { displayErrorMessage("Please select priority"); return false; }

  const listItem = editItem.closest(".list-group-item");

  // Update title
  listItem.childNodes[1].textContent = editedItemText;

  // Update description
  const descEl = listItem.querySelector("#description-at");
  if (descEl) descEl.textContent = editedDescriptionText.trim() ? "Description: " + editedDescriptionText : "";

  // Update due date
  const dueDateEl = listItem.querySelector("#task-dueDate");
  if (dueDateEl) dueDateEl.innerHTML = `📅 <strong>Due:</strong> ${formatDate(dueDateInput.value)}`;

  // Update priority with colour
  const priorityEl = listItem.querySelector("#task-priority");
  const capitalizedPriority = editedPriority.charAt(0).toUpperCase() + editedPriority.slice(1).toLowerCase();
  if (priorityEl) {
    priorityEl.textContent = capitalizedPriority;
    priorityEl.className = "text-muted task-priority-label priority-" + capitalizedPriority;
  }

  // Update category badge
  const categoryEl = listItem.querySelector("#task-category");
  if (categoryEl) categoryEl.textContent = editedCategory;
  listItem.dataset.category = editedCategory;

  // Update card border colour class
  listItem.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;

  // Update subtasks
  const subtaskContainer = listItem.querySelector("#subtask-list");
  if (subtaskContainer) {
    subtaskContainer.innerHTML = "";
    if (formSubtasks.length > 0) {
      const subtaskTitle = document.createElement("p");
      subtaskTitle.className = "subtask-title";
      subtaskTitle.textContent = "Subtasks:";
      subtaskContainer.appendChild(subtaskTitle);
      const subtaskUl = document.createElement("ul");
      subtaskUl.className = "subtask-ul";
      formSubtasks.forEach((st, idx) => {
        const stLi = document.createElement("li");
        stLi.className = "subtask-item" + (st.completed ? " subtask-done" : "");
        stLi.innerHTML = `<input type="checkbox" class="subtask-check" ${st.completed ? "checked" : ""} onchange="toggleSubtask(this, ${idx})"> <span>${st.text}</span>`;
        subtaskUl.appendChild(stLi);
      });
      subtaskContainer.appendChild(subtaskUl);
    }
  }

  // Re-evaluate complete button lock
  const completeBtn = listItem.querySelector(".complete-btn");
  if (completeBtn) {
    const allChecks = listItem.querySelectorAll(".subtask-check");
    const allDone = allChecks.length === 0 || Array.from(allChecks).every(c => c.checked);
    completeBtn.disabled = !allDone;
    completeBtn.title = allDone ? "Mark as complete" : "Complete all subtasks first";
  }

  displaySuccessMessage("Task edited successfully !!!");
  editItem = null;
  itemInput.value = "";
  descriptionInput.value = "";
  dueDateInput.value = "";
  document.getElementById("category").value = "";
  clearFormSubtasks();
  document.getElementById("maintitle").innerText = "Add your tasks below :";
  editTaskBtn.style.display = "none";
  submitBtn.style.display = "inline";
  saveTasksToLocalStorage();
}

//Voice handled adding task logic   [start]
document.addEventListener("DOMContentLoaded", function () {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  let isListening = false;
  const voiceCommandButton = document.getElementById("voice-command-button");
  voiceCommandButton.addEventListener("click", function () {
    if (isListening) {
      recognition.stop();
      isListening = false;
      voiceCommandButton.innerHTML = '<i class="fas fa-microphone"></i>';
    } else {
      recognition.start();
      isListening = true;
      voiceCommandButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    }
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    handleVoiceCommand(transcript);
  };

  recognition.onend = function () {
    isListening = false;
    voiceCommandButton.innerHTML = '<i class="fas fa-microphone"></i>';
  };

  function handleVoiceCommand(command) {
    console.log("Recognized Command:", command);
    const commandParts = command.split(" ");

    if (command.length >= 4) {
      if (command.toLowerCase().includes("add")) {
        const titleIndex = commandParts.indexOf("add") + 1;
        const dueIndex = commandParts.indexOf("due");
        const dateIndex = commandParts.indexOf("date");
        const priorityIndex = commandParts.indexOf("priority");
        if (
          titleIndex < dueIndex &&
          dueIndex < dateIndex &&
          dateIndex < priorityIndex
        ) {
          const taskTitle = commandParts.slice(titleIndex, dueIndex).join(" ");
          const dueDate = commandParts
            .slice(dateIndex + 1, priorityIndex)
            .join(" ");
          const priority = commandParts[priorityIndex + 1];
          addTask(taskTitle, dueDate, priority);
          return;
        }
      } else if (
        command.toLowerCase().includes("edit") &&
        command.toLowerCase().includes("task")
      ) {
        const editIndex = commandParts.indexOf("edit");
        const taskIndex = commandParts.indexOf("task");
        const toIndex = commandParts.indexOf("to");
        const dueDateIndex = commandParts.indexOf("due");
        const priorityIndex = commandParts.indexOf("priority");
        if (
          editIndex !== -1 &&
          taskIndex !== -1 &&
          toIndex !== -1 &&
          dueDateIndex !== -1 &&
          priorityIndex !== -1 &&
          toIndex > taskIndex &&
          dueDateIndex > toIndex &&
          priorityIndex > dueDateIndex &&
          priorityIndex < commandParts.length - 1
        ) {
          const oldTitle = commandParts.slice(taskIndex + 1, toIndex).join(" ");
          const newTitle = commandParts
            .slice(toIndex + 1, dueDateIndex)
            .join(" ");
          const newdueDate = commandParts.slice(
            dueDateIndex + 2,
            dueDateIndex + 4
          );
          const newpriority = capitalizeFirstLetter(
            commandParts[priorityIndex + 1]
          );

          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          editTask(oldTitle, newTitle, newdueDate, newpriority);
          return;
        }
      } else if (command.toLowerCase().includes("delete")) {
        const titleIndex = commandParts.indexOf("task") + 1;
        const taskTitle = commandParts.slice(titleIndex).join(" ");
        deleteTask(taskTitle);
      } else {
        displayErrorMessage("Invalid voice command format.");
      }
    }
  }
  //Voice handled adding task logic   [end]

  function deleteTask(taskTitle) {
    const taskElement = findTaskElement(taskTitle);
    if (taskElement) {
      taskElement.remove();
      saveTasksToLocalStorage();
      displaySuccessMessage(`Task "${taskTitle}" deleted successfully.`);
    } else {
      displayErrorMessage(`Task "${taskTitle}" not found.`);
    }
  }

  //Setting edited data to below cards components
  function editTask(
    oldTitle,
    newTitle,
    newdueDate,
    newpriority,
    newDescription
  ) {
    const taskElement = findTaskElement(oldTitle);
    if (taskElement) {
      const dueDateElement = taskElement.querySelector("#task-dueDate");
      const priorityElement = taskElement.querySelector("#task-priority");
      const descElement = taskElement.querySelector("#description-at");
      const titleTextNode = taskElement.childNodes[1];
      titleTextNode.textContent = titleTextNode.textContent.replace(
        oldTitle,
        newTitle
      );
      //updating fields data
      if (dueDateElement) {
        dueDateElement.textContent = `Due Date: ${newdueDate}`;
        dueDateElement.id = "task-dueDate";
      }
      if (priorityElement) {
        priorityElement.textContent = newpriority;
        priorityElement.id = "task-priority";
      }
      if (descElement) {
        descElement.textContent = newDescription;
        descElement.id = "task-description";
      }

      //redesplaying task data in cards
      displayTaskDetails(taskElement);
      saveTasksToLocalStorage();
      displaySuccessMessage(`Task "${oldTitle}" edited successfully.`);
    } else {
      displayErrorMessage(`Task "${oldTitle}" not found.`);
    }
  }

  //returns the instance of task to be deleted or edited
  function findTaskElement(taskTitle) {
    const tasks = document.querySelectorAll(".list-group-item");
    for (const task of tasks) {
      const title = task.childNodes[1].textContent.trim().toLowerCase();
      if (title === taskTitle.toLowerCase()) {
        return task;
      }
    }
    return null;
  }

  //logic to add task, can be used for voice commands only, (need to be update this function!)
  function addTask(taskTitle, dueDate, priority) {
    const todoList = document.getElementById("taskList");
    const existingTasks = todoList.querySelectorAll("li");
    existingTasks.forEach((item) =>
      console.log(item.textContent.trim().toLowerCase())
    );
    const taskExists = Array.from(existingTasks).some(
      (item) =>
        item.textContent.trim().toLowerCase() === taskTitle.trim().toLowerCase()
    );

    if (taskExists) {
      displayErrorMessage("Task already exists !!!");
      return;
    }

    const li = document.createElement("li");
    const capitalizedPriority =
      priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
    console.log("Priority:", priority);
    console.log("Priority Class:", priorityColors[capitalizedPriority]);

    li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[capitalizedPriority]}`;

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "form-check-input task-completed";
    completeCheckbox.addEventListener("change", markAsComplete);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-outline-danger float-right delete";
    deleteButton.innerHTML =
      '<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';

    const editButton = document.createElement("button");
    editButton.className = "btn btn-outline-success btn-sm float-right edit";
    editButton.innerHTML =
      '<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
    editButton.style.marginRight = "8px";
    editButton.addEventListener("click", handleEditItem);

    const dateTimeParagraph = document.createElement("p");
    dateTimeParagraph.className = "text-muted";
    dateTimeParagraph.id = "created-at";
    dateTimeParagraph.style.fontSize = "15px";
    dateTimeParagraph.style.margin = "0 19px";
    dateTimeParagraph.appendChild(
      document.createTextNode("Created:" + new Date().toLocaleString())
    );

    const dueDateParagraph = document.createElement("p");
    dueDateParagraph.className = "text-muted";
    dueDateParagraph.id = "task-dueDate";
    dueDateParagraph.style.fontSize = "15px";
    dueDateParagraph.style.margin = "0 19px";
    dueDateParagraph.appendChild(
      document.createTextNode("Due Date:" + dueDate)
    );

    const priorityParagraph = document.createElement("p");
    priorityParagraph.className = "text-muted";
    priorityParagraph.id = "task-priority";
    priorityParagraph.style.fontSize = "15px";
    priorityParagraph.style.margin = "0 19px";
    priorityParagraph.appendChild(document.createTextNode(capitalizedPriority));

    li.appendChild(completeCheckbox);
    li.appendChild(document.createTextNode(taskTitle));
    li.appendChild(deleteButton);
    li.appendChild(editButton);
    li.appendChild(dateTimeParagraph);
    li.appendChild(dueDateParagraph);
    li.appendChild(priorityParagraph);
    todoList.appendChild(li);
    saveTasksToLocalStorage();

    displayTaskDetails(li);
  }
});
//adding tasks through voice command ends here

//logging task details for debugging purpose, does nothing change in UI.
function displayTaskDetails(taskElement) {
  if (taskElement) {
    const dueDateElement = taskElement.querySelector("#task-dueDate");
    const priorityElement = taskElement.querySelector("#task-priority");
    const dueDate = dueDateElement
      ? dueDateElement.textContent.split(":")[1].trim()
      : null;
    const priority = priorityElement
      ? priorityElement.textContent.trim()
      : null;
    console.log(`Task Details - Due Date: ${dueDate}, Priority: ${priority}`);
  }
}

function showComfirmboxForDuplicateTasks() {
  const confirmationBox = document.getElementById("duplicate-task");

  //display confirmination message
  delalert_title = document.getElementById("duplicate-msg");
  delalert_title.innerHTML = "&#9888; This task is already present";
  delalert_title.className = "alert alert-danger";
  delalert_title.role = "alert";

  const confirmYesButton = document.getElementById("duplicate-ok");
  const confirmCancelButton = document.getElementById("duplicate-cancel");

  //conform message controls click logic
  const handleYesClick = () => {
    confirmationBox.style.display = "none";
    confirmYesButton.removeEventListener("click", handleYesClick);
    confirmCancelButton.removeEventListener("click", handleCancelClick);
  };

  const handleCancelClick = () => {
    confirmationBox.style.display = "none";
    confirmYesButton.removeEventListener("click", handleYesClick);
    confirmCancelButton.removeEventListener("click", handleCancelClick);
  };

  confirmYesButton.addEventListener("click", handleYesClick);
  confirmCancelButton.addEventListener("click", handleCancelClick);

  confirmationBox.style.display = "flex";
}

//adding tasks through form manually-logic
function addItem(e) {
  e.preventDefault();
  tasksCheck();
  const newTaskTitle = document.getElementById("item").value;
  const description = document.getElementById("description").value;
  let dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value || "Other";
  const subtasks = [...formSubtasks];

  // Check if the due date has already passed
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);

  //check if the tasks are duplicate
  if (checkForDuplicateTasks(newTaskTitle)) {
    showComfirmboxForDuplicateTasks();
    return false;
  }

  let isDescritionPresent = description.trim() === "" ? false : true;

  //form validation code
  if (!newTaskTitle) {
    displayErrorMessage("Task Title should be filled!!!");
    tasksHeading.classList.add("hidden");
    searchBar.classList.add("hidden");
    return false;
  } else if (!dueDate) {
    displayErrorMessage("Please specify a due date !!!");
    return false;
  } else if (dueDateObj < currentDate) {
    displayErrorMessage("Due date has already passed !!!");
    return false;
  } else {
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
  }

  if (newTaskTitle.trim() === "") return false;
  else {
    document.getElementById("item").value = "";
    document.querySelector(".clear_btn").style.display = "inline";
    document.querySelector(".dropdown").style.display = "inline";
    document.getElementById("statistics-btn").style.display = "inline-flex";
  }
  const creationDateTime = new Date().toLocaleString();
  createNewTask(
    newTaskTitle,
    creationDateTime,
    dueDate,
    priority,
    description,
    isDescritionPresent,
    category,
    subtasks
  );
  saveTasksToLocalStorage();

  //clearing form fields after 'add' button
  document.getElementById("dueDate").value = "";
  document.getElementById("description").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("category").value = "";
  clearFormSubtasks();
}

//check for duplicate tasks
function checkForDuplicateTasks(newTaskTitle) {
  var taskList = document.getElementById("taskList");
  var listItems = taskList.querySelectorAll("li");
  var textArray = [];

  listItems.forEach(function (li) {
    // Get the text and extract the text content
    var textContent = li.textContent.trim();
    // Push the text content into the array
    textArray.push(textContent);
  });
  TitleArray = textArray.map(function (element) {
    // Use regular expression to match and capture the substring before "Description"
    var match = element.match(/^(.*?)Description/);
    // Check if there is a match and extract the captured group
    return match ? match[1] : null;
  });
  let isnewTitlepresent = TitleArray.includes(newTaskTitle);
  return isnewTitlepresent;
}

//logic for various item click events
function handleItemClick(e) {
  if (e.target.classList.contains("delete")) {
    e.preventDefault();
    const li = e.target.parentElement;
    const confirmationBox = document.getElementById("custom-confirm");

    //display confirmination message
    delalert_title = document.getElementById("confirm-msg");
    delalert_title.innerHTML =
      "&#9888; Are you sure you want to delete this task?";
    delalert_title.className = "alert alert-danger";
    delalert_title.role = "alert";

    const confirmYesButton = document.getElementById("confirm-yes");
    const confirmNoButton = document.getElementById("confirm-no");
    const confirmCancelButton = document.getElementById("confirm-cancel");

    //conform message controls click logic
    const handleYesClick = () => {
      confirmationBox.style.display = "none";
      li.parentElement.removeChild(li);
      tasksCheck();
      displaySuccessMessage("Task deleted successfully !!!");
      saveTasksToLocalStorage();
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleNoClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    const handleCancelClick = () => {
      confirmationBox.style.display = "none";
      confirmYesButton.removeEventListener("click", handleYesClick);
      confirmNoButton.removeEventListener("click", handleNoClick);
      confirmCancelButton.removeEventListener("click", handleCancelClick);
    };

    confirmYesButton.addEventListener("click", handleYesClick);
    confirmNoButton.addEventListener("click", handleNoClick);
    confirmCancelButton.addEventListener("click", handleCancelClick);

    confirmationBox.style.display = "flex";
  }
  saveTasksToLocalStorage();
}

function markAsComplete(e) {
  const li = e.target.parentElement;
  const originalClassList = li.dataset.originalClassList;
  const editButton = li.querySelector(".edit");
  // Toggle the visibility of the button
  if (editButton)
    editButton.style.display =
      editButton.style.display === "none" ? "block" : "none";
  // If the original class list is stored, toggle it back
  if (originalClassList) {
    li.className = originalClassList;
    li.removeAttribute("data-original-class-list");
  } else {
    // If the original class list is not stored, store it and toggle "task-completed"
    li.dataset.originalClassList = li.className;
    li.classList.toggle("task-completed");
  }
  saveTasksToLocalStorage();
}

// message box for success
function displaySuccessMessage(message) {
  document.getElementById("lblsuccess").innerHTML = message;
  document.getElementById("lblsuccess").style.display = "block";
  setTimeout(function () {
    document.getElementById("lblsuccess").style.display = "none";
  }, 3000);
}

// message box for error
function displayErrorMessage(message) {
  document.getElementById("lblerror").innerHTML = message;
  document.getElementById("lblerror").style.display = "block";
  setTimeout(function () {
    document.getElementById("lblerror").style.display = "none";
  }, 3000);
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  const tasks = document.querySelectorAll(".list-group-item");
  const tasksArray = extractTasksData(tasks);
  storeTasksInLocalStorage(tasksArray);
  
  // Also save to user account if logged in
  if (currentUser) {
    const users = JSON.parse(localStorage.getItem('todo_users')) || {};
    if (users[currentUser]) {
      users[currentUser].tasks = tasksArray;
      localStorage.setItem('todo_users', JSON.stringify(users));
    }
  }
}

// Function to extract task data from DOM elements
// Function to extract tasks data from the DOM
function extractTasksData(tasks) {
  return Array.from(tasks).map((task) => {
    const taskText = task.childNodes[1].textContent;
    const isCompleted = task.classList.contains("completed") || task.classList.contains("task-completed");
    const createdAt = task.querySelector("#created-at")?.textContent || "";
    const description = task.querySelector("#description-at")
      ? task.querySelector("#description-at").textContent
      : "";
    const dueDate = task.querySelector("#task-dueDate")?.textContent || "";
    const priority = task.querySelector("#task-priority")?.textContent || "";
    // ===== FEATURE 2: Extract category and subtasks =====
    const category = task.querySelector("#task-category")?.textContent?.replace("Category: ", "") || "";
    const subtasksEl = task.querySelector("#task-subtasks");
    const subtasks = subtasksEl ? Array.from(subtasksEl.querySelectorAll('li')).map(li => li.textContent) : [];

    return createTaskObject(
      taskText,
      isCompleted,
      createdAt,
      dueDate,
      priority,
      description,
      category,
      subtasks
    );
  });
}

// Function to create a task object
function createTaskObject(
  text,
  completed,
  createdAt,
  dueDate,
  priority,
  description,
  category,
  subtasks
) {
  return {
    text,
    completed,
    createdAt,
    dueDate,
    priority,
    description,
    category: category || '',
    subtasks: subtasks || [],
  };
}

// Function to store tasks in local storage
function storeTasksInLocalStorage(tasksArray) {
  localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

// Function to retrieve tasks from local storage
function getTasksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Function to display tasks
function loadTasksFromLocalStorage() {
  const tasks = getTasksFromLocalStorage();
  const clearButton = document.querySelector(".clear_btn");
  const dropdown = document.querySelector(".dropdown");
  const statsBtn = document.getElementById("statistics-btn");

  if (tasks.length > 0) {
    tasksHeading.classList.remove("hidden");
    searchBar.classList.remove("hidden");
    if (clearButton) clearButton.style.display = "inline";
    if (dropdown) dropdown.style.display = "inline-block";
    if (statsBtn) statsBtn.style.display = "inline-flex";

    tasks.forEach((task) => {
      displayTask(task);
    });
  }
}

// Function to create and display a single task
function displayTask(task) {
  const isDescPresent = task.description && task.description.trim() !== "" && task.description !== "Description: ";
  const rawDue = task.dueDate.includes(": ") ? task.dueDate.split(": ").slice(1).join(": ") : task.dueDate.split(":").slice(1).join(":");
  createNewTask(
    task.text,
    task.createdAt ? task.createdAt.slice(8) : new Date().toLocaleString(),
    rawDue.trim(),
    task.priority || "Low",
    task.description ? task.description.replace("Description: ", "") : "",
    isDescPresent,
    task.category || "Other",
    task.subtasks || []
  );
}

// Function to enable submit button
function enableSubmit(ref, btnID) {
  document.getElementById(btnID).disabled = false;
}

// Function to toggle between light and dark mode
function toggleMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  if (modeToggleBtn.checked === true) {
    localStorage.setItem("dark-mode", "enabled");
  } else {
    localStorage.setItem("dark-mode", null);
  }
}

// Function to clear all tasks
function clearAllTasks() {
  const taskList = document.getElementById("taskList"); // Replace with your actual task list ID
  const confirmationBoxAll = document.getElementById("custom-confirm-all");
  const alertTitle = document.getElementById("confirm-msg-all");
  const confirmYesButtonAll = document.getElementById("confirm-yes-all");
  const confirmNoButtonAll = document.getElementById("confirm-no-all");
  const confirmCancelButtonAll = document.getElementById("confirm-cancel-all");

  if (taskList.children.length > 0) {
    alertTitle.innerHTML = "&#9888; Are you sure you want to delete all tasks?";
    alertTitle.className = "alert alert-danger";
    alertTitle.role = "alert";

    confirmYesButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
      while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
      }
      document.querySelector(".clear_btn").style.display = "none";
      document.querySelector(".dropdown").style.display = "none";
      const statsBtn = document.getElementById("statistics-btn");
      if (statsBtn) statsBtn.style.display = "none";
      tasksHeading.classList.add("hidden");
      searchBar.classList.add("hidden");
      localStorage.clear();

      // saveTasksToLocalStorage();
    });

    confirmNoButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
    });

    confirmCancelButtonAll.addEventListener("click", () => {
      confirmationBoxAll.style.display = "none";
    });

    confirmationBoxAll.style.display = "flex";
  } else {
    // If there are no tasks, you may choose to show a message or take alternative action
    // alert("No tasks to clear");
  }
}

// Function to sort task list by due date
function sortByDueDate(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));

  if (order === "early") {
    sortTaskList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (order === "late") {
    sortTaskList.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  }

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

// Function to sort task list by priority
function sortByPriority(order) {
  const sortTaskList = JSON.parse(localStorage.getItem("tasks"));

  sortTaskList.sort((a, b) => {
    if (order === "highToLow") {
      return priorityValues[b.priority] - priorityValues[a.priority];
    } else if (order === "lowToHigh") {
      return priorityValues[a.priority] - priorityValues[b.priority];
    } else {
      return 0;
    }
  });

  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  tasksHeading.classList.add("hidden");
  searchBar.classList.add("hidden");
  localStorage.setItem("tasks", JSON.stringify(sortTaskList));
  loadTasksFromLocalStorage();
}

// Function to handle dropdown menu
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Function to close dropdown menu when clicking outside
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

// ===== FEATURE 4: TASK STATISTICS PANEL =====
function showTaskStatistics() {
  const tasks = getTasksFromLocalStorage();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-completed').textContent = completed;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-rate').textContent = rate + '%';
  document.getElementById('statistics-panel').style.display = 'flex';
}

// Function to create a new task
function createNewTask(
  taskTitle,
  createdDate,
  dueDate,
  priority,
  description,
  isDescritionPresent,
  category,
  subtasks
) {
  category = category || "Other";
  subtasks = subtasks || [];

  const li = document.createElement("li");
  li.className = `list-group-item card shadow mb-4 bg-transparent ${priorityColors[priority]}`;
  li.dataset.category = category;

  const completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.className = "form-check-input task-completed complete-btn";
  completeCheckbox.title = subtasks.length > 0 ? "Complete all subtasks first" : "Mark as complete";
  if (subtasks.length > 0) completeCheckbox.disabled = true;
  completeCheckbox.addEventListener("change", markAsComplete);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-outline-danger float-right delete";
  deleteButton.innerHTML = '<ion-icon name="trash-outline" style="font-size: 20px"></ion-icon>';
  deleteButton.style.paddingTop = "10px";

  const editButton = document.createElement("button");
  editButton.className = "btn btn-outline-secondary btn-sm float-right edit";
  editButton.innerHTML = '<ion-icon name="create-outline" style="font-size: 20px"></ion-icon>';
  editButton.style.marginRight = "8px";
  editButton.style.paddingTop = "10px";
  editButton.addEventListener("click", function (e) { handleEditItem(e); });

  // Category badge
  const categoryBadge = document.createElement("span");
  categoryBadge.className = "category-badge";
  categoryBadge.id = "task-category";
  categoryBadge.textContent = category;

  const descriptionParagraph = document.createElement("p");
  if (isDescritionPresent === true) {
    descriptionParagraph.className = "text-muted";
    descriptionParagraph.id = "description-at";
    descriptionParagraph.style.fontSize = "15px";
    descriptionParagraph.style.margin = "0 19px";
    descriptionParagraph.appendChild(document.createTextNode("Description: " + description));
  }

  const dateTimeParagraph = document.createElement("p");
  dateTimeParagraph.className = "task-created-label";
  dateTimeParagraph.id = "created-at";
  dateTimeParagraph.textContent = "Created: " + createdDate;

  const dueDateParagraph = document.createElement("p");
  dueDateParagraph.className = "task-info-badge duedate-badge";
  dueDateParagraph.id = "task-dueDate";
  dueDateParagraph.innerHTML = `📅 <strong>Due:</strong> ${formatDate(dueDate)}`;

  const priorityParagraph = document.createElement("p");
  priorityParagraph.className = `text-muted task-priority-label priority-${priority}`;
  priorityParagraph.id = "task-priority";
  priorityParagraph.style.fontSize = "15px";
  priorityParagraph.style.margin = "0 19px";
  priorityParagraph.appendChild(document.createTextNode(priority));

  // Subtasks section
  const subtaskContainer = document.createElement("div");
  subtaskContainer.className = "subtask-container";
  subtaskContainer.id = "subtask-list";

  if (subtasks.length > 0) {
    const subtaskTitle = document.createElement("p");
    subtaskTitle.className = "subtask-title";
    subtaskTitle.textContent = "Subtasks:";
    subtaskContainer.appendChild(subtaskTitle);

    const subtaskUl = document.createElement("ul");
    subtaskUl.className = "subtask-ul";
    subtasks.forEach((st, idx) => {
      const stLi = document.createElement("li");
      stLi.className = "subtask-item" + (st.completed ? " subtask-done" : "");
      stLi.innerHTML = `<input type="checkbox" class="subtask-check" ${st.completed ? "checked" : ""} onchange="toggleSubtask(this, ${idx})"> <span>${st.text}</span>`;
      subtaskUl.appendChild(stLi);
    });
    subtaskContainer.appendChild(subtaskUl);
  }

  li.appendChild(completeCheckbox);
  li.appendChild(document.createTextNode(taskTitle));
  li.appendChild(deleteButton);
  li.appendChild(editButton);
  li.appendChild(categoryBadge);
  li.appendChild(descriptionParagraph);
  li.appendChild(dueDateParagraph);
  li.appendChild(priorityParagraph);
  li.appendChild(subtaskContainer);
  li.appendChild(dateTimeParagraph);

  taskList.appendChild(li);
  displayTaskDetails(li);
}

// Function to hide preloader
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    document.querySelector(".preloader").style.display = "none";
  }, 2000);
});

// Function to simulate typing effect for header text
document.addEventListener("DOMContentLoaded", function () {
  const headerText = "To-Do List Application";
  const headerElement = document.getElementById("todo-header");

  function typeText(text, index) {
    headerElement.textContent = text.slice(0, index);

    if (index < text.length) {
      setTimeout(function () {
        typeText(text, index + 1);
      }, 50);
    }
  }

  typeText(headerText, 0);
});

// Function to handle dark mode preference
function themeSwitcher() {
  if (localStorage.length === 0) {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("dark-mode", "enabled");
      modeToggleBtn.checked = true;
    } else {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("dark-mode", null);
    }
  } else {
    if (localStorage.getItem("dark-mode") === "enabled") {
      document.body.classList.toggle("dark-mode");
      modeToggleBtn.checked = true;
    } else {
      document.body.classList.toggle("light-mode");
    }
  }
}
themeSwitcher();function extractTasksData(tasks) {
  return Array.from(tasks).map((task) => {
    const taskText = task.childNodes[1].textContent;
    const isCompleted = task.classList.contains("completed") || task.classList.contains("task-completed");
    const createdAt = task.querySelector("#created-at")?.textContent || "";
    const description = task.querySelector("#description-at")
      ? task.querySelector("#description-at").textContent : "";
    const dueDate = task.querySelector("#task-dueDate")?.textContent || "";
    const priority = task.querySelector("#task-priority")?.textContent || "";
    const category = task.dataset.category || "Other";
    const subtaskItems = task.querySelectorAll(".subtask-item");
    const subtasks = Array.from(subtaskItems).map(st => ({
      text: st.querySelector("span").textContent,
      completed: st.querySelector(".subtask-check").checked
    }));
    return { text: taskText, completed: isCompleted, createdAt, dueDate, priority, description, category, subtasks };
  });
}
