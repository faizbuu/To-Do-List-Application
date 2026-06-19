# Changelog

All notable changes to this project are documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] - 2026-06-14

### Added

#### Feature 1 — User Authentication System
- Register/login modal with username and password fields
- `registerUser()` function — stores new users under `todo_users` localStorage key
- `loginUser()` function — validates credentials and sets `sessionStorage.currentUser`
- `logoutUser()` function — clears session and resets UI
- `updateAuthUI()` function — toggles Login/Register/Logout button visibility
- `loadUserTasks()` function — loads the logged-in user's task array on login
- Per-user task isolation — each user's tasks stored under their own username key
- GitHub icon repositioned below auth buttons for better visibility

#### Feature 2 — Enhanced Task Organisation
- Category dropdown in the task form (Work, Personal, School, Health, Shopping, Other)
- Category badge displayed on each task card
- `addSubtaskToForm()` — adds subtask entries to the in-form preview list
- `renderFormSubtasks()` — rebuilds the subtask list UI inside the form
- `removeFormSubtask(index)` — removes a subtask from the form list by index
- `clearFormSubtasks()` — resets the form subtask state after saving
- `toggleSubtask(checkbox, idx)` — marks subtask done and evaluates complete button lock
- `filterByCategory(category)` — filters task list by category, updates active button
- `formatDate(dateStr)` — converts YYYY-MM-DD to DD-MM-YYYY for display
- Category filter bar with seven pill buttons above the Sort By dropdown
- Subtask checklist rendered inside each task card
- Complete button locked (disabled) until all subtasks are ticked
- Due dates displayed in DD-MM-YYYY format

#### Feature 3 — UI Refinement
- Static "To-Do List 📝" heading replacing the animated Typed.js title
- Colour-coded priority labels: `.priority-High` (red), `.priority-Medium` (amber), `.priority-Low` (green)
- Amber pill badge for due date with 📅 emoji prefix
- Task creation timestamp repositioned to bottom-right of each task card
- "Add a subtask... (Optional)" placeholder text on subtask input
- Add/Edit buttons centred below the subtask section

#### Feature 4 — Task Statistics Panel
- Statistics button in the task area (visible only when tasks exist)
- `showTaskStatistics()` — reads localStorage and computes total, completed, pending, and rate
- Statistics modal displaying four stat items with colour-coded values
- Completion rate calculated as `Math.round((completed / total) * 100)`

### Changed
- `createNewTask()` — extended to accept `category` and `subtasks` parameters
- `addItem()` — updated to collect category and subtasks from form fields
- `extractTasksData()` — updated to save `category` and `subtasks` array in localStorage
- `displayTask()` — updated to reload `category` and `subtasks` from localStorage
- `handleEditItem()` — rewritten to use `querySelector` instead of `childNodes` index
- `handleEditClick()` — rewritten to use `querySelector` and update all fields correctly
- `saveTasksToLocalStorage()` — extended to also write tasks to the active user's entry
- CSS checkbox selector updated to `:not(.subtask-check):not(.complete-btn)` to prevent style conflicts
- Task object schema extended with `category` (string) and `subtasks` (array) fields

### Removed
- Typed.js CDN script and `startTypedAnimation()` function call
- Animated `<span id="element">` title target element

### Fixed
- Edit form incorrectly reading category value into description field (childNodes index shift bug)
- Priority label not updating correctly after edit (same root cause)
- Subtask chips rendering horizontally instead of vertically (global `ul { display: flex }` conflict)
- Complete button rendering as a toggle-switch circle instead of a square checkbox

---

## [1.0.0] - Original Release

Original To-Do List Application by Kritika30032002.
Features: task CRUD, priority levels, due dates, keyword search, sort, voice commands, dark/light mode, localStorage persistence.
