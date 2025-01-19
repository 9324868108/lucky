// Helper functions to show/hide sections
const authSection = document.getElementById('auth-section');
const taskSection = document.getElementById('task-section');
const authMessage = document.getElementById('auth-message');
const tasksList = document.getElementById('tasks-list');

// Local storage keys
const USER_KEY = 'todoUser';
const TASKS_KEY = 'tasks';

// Check if user is logged in (using local storage)
const currentUser = JSON.parse(localStorage.getItem(USER_KEY));

// Display tasks if user is logged in, else show auth screen
if (currentUser) {
  showTaskSection();
} else {
  showAuthSection();
}

// Show the task management section
function showTaskSection() {
  authSection.style.display = 'none';
  taskSection.style.display = 'flex';
  loadTasks();
}

// Show the authentication section
function showAuthSection() {
  authSection.style.display = 'flex';
  taskSection.style.display = 'none';
}

// Handle login
document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simple email/password validation (no backend)
  if (email && password) {
    localStorage.setItem(USER_KEY, JSON.stringify({ email }));
    showTaskSection();
  } else {
    authMessage.textContent = 'Please enter valid credentials!';
  }
});

// Handle signup
document.getElementById('signup-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
    localStorage.setItem(USER_KEY, JSON.stringify({ email }));
    showTaskSection();
  } else {
    authMessage.textContent = 'Please enter valid credentials!';
  }
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem(USER_KEY);
  showAuthSection();
});

// Handle adding tasks
document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;
  const category = document.getElementById('task-category').value;
  const priority = document.getElementById('task-priority').value;
  const dueDate = document.getElementById('task-due-date').value;

  const task = {
    title,
    description,
    category,
    priority,
    dueDate,
    completed: false,
  };

  // Save task to localStorage
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks.push(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));

  loadTasks();
  checkNotifications(task);
  document.getElementById('task-form').reset();
});

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasksList.innerHTML = '';

  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task-item');
    if (task.completed) taskElement.classList.add('completed');

    taskElement.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        ${task.description}<br>
        <small>Category: ${task.category} | Priority: ${task.priority} | Due: ${task.dueDate}</small>
      </div>
      <button onclick="toggleCompletion(${index})">Complete</button>
      <button onclick="deleteTask(${index})">Delete</button>
    `;
    tasksList.appendChild(taskElement);
  });
}

// Mark task as completed or pending
function toggleCompletion(index) {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  loadTasks();
}

// Delete task
function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
  tasks.splice(index, 1);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  loadTasks();
}

// Check if the task's due date is near, send notification
function checkNotifications(task) {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  
  if (dueDate - now <= 3600000) { // 1 hour before due date
    setTimeout(() => {
      new Notification(`Task Due: ${task.title}`, {
        body: `${task.description}. Due soon!`,
      });
    }, dueDate - now);
  }
}

// Request notification permission
if (Notification.permission !== 'granted') {
  Notification.requestPermission();
}
