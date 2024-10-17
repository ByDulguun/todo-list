// Selectors
const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const openModalBtn = document.querySelector(".open-modal-btn");
const closeModalBtn = document.querySelector(".modal-close-btn");
const modal = document.querySelector(".modal-container");
const selectInput = document.querySelector("#status");

// Create storage for tasks
const tasks = {
  "To Do": [],
  "In Progress": [],
  Done: [],
  Blocked: [],
};

// Save tasks to Local Storage
const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Load tasks from Local Storage
const loadTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    Object.assign(tasks, JSON.parse(storedTasks));
  }
};

// Open modal
openModalBtn.addEventListener("click", () => {
  modal.classList.add("open");
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("open");
});

// Template for each card
const cardTemplate = (title, description, id, status) => {
  return `
    <div class="card" draggable="true" ondragstart="drag(event)" data-id="${id}" data-status="${status}">
      <div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
      <div onclick="deleteItem('${id}')">X</div>
    </div>
  `;
};

// Render cards for each status
const render = () => {
  const toDoContainer = document.querySelector(".cards .card-container");
  const inProgressContainer = document.querySelector(".cards1 .card-container");
  const doneContainer = document.querySelector(".cards2 .card-container");
  const blockedContainer = document.querySelector(".cards3 .card-container");

  // Clear existing cards
  toDoContainer.innerHTML = "";
  inProgressContainer.innerHTML = "";
  doneContainer.innerHTML = "";
  blockedContainer.innerHTML = "";

  Object.entries(tasks).forEach(([status, taskList]) => {
    taskList.forEach((task) => {
      const taskCard = cardTemplate(
        task.title,
        task.description,
        task.id,
        status
      );

      // Add tasks to the correct container based on status
      if (status === "To Do") {
        toDoContainer.innerHTML += taskCard;
      } else if (status === "In Progress") {
        inProgressContainer.innerHTML += taskCard;
      } else if (status === "Done") {
        doneContainer.innerHTML += taskCard;
      } else if (status === "Blocked") {
        blockedContainer.innerHTML += taskCard;
      }
    });
  });
};

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = selectInput.value;

  if (!title || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const newTask = {
    id: `${Date.now()}`, // Unique ID based on timestamp
    title,
    description,
  };

  tasks[status].push(newTask); // Add task to the corresponding status
  saveTasksToLocalStorage(); // Save to Local Storage
  render(); // Re-render the task lists
  modal.classList.remove("open"); // Close modal

  // Clear input fields
  titleInput.value = "";
  descriptionInput.value = "";
});

// Function to delete a task
const deleteItem = (id) => {
  Object.entries(tasks).forEach(([status, taskList]) => {
    const index = taskList.findIndex((task) => task.id === id);
    if (index !== -1) {
      taskList.splice(index, 1); // Remove task from the list
      saveTasksToLocalStorage(); // Save to Local Storage
    }
  });
  render(); // Re-render the task lists
};

// Drag and drop
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.dataset.id);
  event.dataTransfer.setData("status", event.target.dataset.status);
}

function drop(event, newStatus) {
  event.preventDefault();
  const id = event.dataTransfer.getData("text");
  const currentStatus = event.dataTransfer.getData("status");

  if (currentStatus !== newStatus) {
    const taskIndex = tasks[currentStatus].findIndex((task) => task.id === id);
    const task = tasks[currentStatus].splice(taskIndex, 1)[0];
    tasks[newStatus].push(task);
    saveTasksToLocalStorage(); // Save to Local Storage
    render();
  }
}

// Add event listeners to the card containers for drop functionality
document
  .querySelectorAll(".cards, .cards1, .cards2, .cards3")
  .forEach((container) => {
    container.ondrop = (event) => drop(event, container.dataset.status);
    container.ondragover = allowDrop;
  });

// Load tasks and render on page load
window.addEventListener("load", () => {
  loadTasksFromLocalStorage();
  render(); // Render the loaded tasks
});
