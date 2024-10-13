const form = document.querySelector("form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const openModalBtn = document.querySelector(".open-modal-btn");
const closeModalBtn = document.querySelector(".modal-close-btn");
const modal = document.querySelector(".modal-container");
const selectInput = document.querySelector("#status");

// Create storage for tasks
const tasks = {
  "In Progress": [],
  Done: [],
  Blocked: [],
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
const cardTemplate = (title, description, id) => {
  return `
    <div class="card">
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
  const cards1 = document.querySelector(".cards1 .card-container");
  const cards2 = document.querySelector(".cards2 .card-container");
  const cards3 = document.querySelector(".cards3 .card-container");

  cards1.innerHTML = ""; // Clear existing cards
  cards2.innerHTML = "";
  cards3.innerHTML = "";

  Object.entries(tasks).forEach(([status, taskList]) => {
    taskList.forEach((task) => {
      const taskCard = cardTemplate(task.title, task.description, task.id);
      if (status === "In Progress") {
        cards1.innerHTML += taskCard;
      } else if (status === "Done") {
        cards2.innerHTML += taskCard;
      } else if (status === "Blocked") {
        cards3.innerHTML += taskCard;
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
    }
  });
  render(); // Re-render the task lists
};
