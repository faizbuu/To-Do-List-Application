# 📝 To-Do List Application

A lightweight, browser-based task management application built with HTML, CSS, and JavaScript. No backend or server required — all data is stored locally in your browser.

Originally developed by [Kritika30032002](https://github.com/Kritika30032002/To-Do-List-Application). Enhanced by Group 11, CSE6364 Software Evolution & Maintenance, Multimedia University (TT4L).

---

## 🚀 Features

### Original Features
- Add tasks with a title, description, priority level (Low, Medium, High), and due date
- Edit and delete tasks
- Mark tasks as completed
- Sort tasks by priority or due date
- Search tasks by keyword
- Voice command interface
- Light and dark mode toggle
- Persistent storage via localStorage

### New Features (Group 11 Enhancements)

#### 🔐 User Authentication
- Register a personal account with a username and password
- Log in to access your private task list
- Log out to end your session
- Multiple users can share one device with fully isolated task data
- All user data stored securely in localStorage under the `todo_users` key

#### 🗂️ Enhanced Task Organisation
- Assign a **category** to each task: Work 💼, Personal 🏠, School 📚, Health 💪, Shopping 🛒, Other 📌
- Add **subtasks** to any task using the subtask input field
- Each subtask can be individually ticked off
- The task complete button is **locked** until all subtasks are checked
- **Category filter bar** above the task list — click any category to show only those tasks
- Due dates displayed in **DD-MM-YYYY** format for clarity

#### 🎨 UI Refinement
- Replaced the distracting animated Typed.js title with a clean static heading
- **Colour-coded priority labels**: High = red, Medium = amber, Low = green
- Due date shown as a styled **amber badge** with 📅 emoji
- Task creation timestamp pinned to the **bottom-right** of each task card
- Subtask "(Optional)" placeholder text to guide users

#### 📊 Task Statistics Panel
- Click the **Statistics** button to open a summary panel
- Displays: Total Tasks, Completed Tasks, Pending Tasks, Completion Rate (%)
- Statistics read directly from localStorage — unaffected by category filters

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and UI |
| CSS3 | Styling, dark/light mode, animations |
| JavaScript (ES6+) | Application logic |
| Bootstrap 4 | Layout and responsive design |
| Flatpickr | Date picker |
| Animate.css | UI animations |
| Ionicons | Task card icons |
| Font Awesome | Statistics and GitHub icons |
| localStorage | Task and user data persistence |
| sessionStorage | Active user session management |

> **Note:** Typed.js was removed as part of the UI Refinement enhancement.

---

## 📦 Installation

No installation required. This is a fully client-side application.

1. Download or clone this repository
2. Open the `index.html` file in any modern web browser
3. No build step, no server, no dependencies to install

---

## 📖 Usage Guide

### Getting Started
1. Click **Register** (top-right) to create a new account
2. Enter a username and password, then click Register
3. Click **Login** and enter your credentials
4. Your personal task list will load automatically

### Adding a Task
1. Enter a task name in the **Enter Task Name** field
2. Optionally add a description
3. Select a **Category** from the dropdown
4. Select a **Priority** level (Low / Medium / High)
5. Click **Date** to pick a due date
6. Optionally type subtasks in the **Add a subtask... (Optional)** field and click **+ Add**
7. Click **Add** to save the task

### Managing Subtasks
- Subtasks appear as a checklist inside the task card
- Tick each subtask checkbox individually to mark it done
- The task complete button remains locked until **all** subtasks are ticked
- Once all subtasks are done, tick the complete button to mark the whole task as complete

### Filtering by Category
- Use the category filter bar above the Sort By button
- Click any category to show only tasks in that group
- Click **All** to show all tasks again

### Viewing Statistics
- Click the **Statistics** button (visible when tasks exist)
- The panel shows Total Tasks, Completed, Pending, and Completion Rate
- Click × to close

### Logging Out
- Click **Logout** to end your session
- Your tasks are saved and will reload on your next login

---

## ⚠️ Important Notes

- All data is stored **locally in your browser**. Clearing browser data will erase all accounts and tasks.
- The application works best in **Google Chrome** or **Microsoft Edge**.
- Voice commands require microphone permission in the browser.

---

## 👥 Contributors

**Original Developer**
- [Kritika30032002](https://github.com/Kritika30032002)

**Group 11 — CSE6364, MMU TT4L**
- Ahmad Faiz Bin Anuar (1211109154) — Enhanced Task Organisation
- Muhammad Aqil Bin Rahmat (1211107976) — UI Refinement, Task Statistics Panel
- Wan Muhammad Ilhan Bin Wan Zil Azhar (1211102908) — User Authentication System

---

## 📄 License

This project is open source. See the original repository for license details.
