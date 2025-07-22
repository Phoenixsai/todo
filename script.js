"use strict";
const taskInput = document.querySelector(".text");
const submitButton = document.querySelector(".btn");
const parentElement = document.querySelector(".main");

let tasks = [];

// 🔁 Load tasks from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks && Array.isArray(storedTasks)) {
    tasks = storedTasks;
    tasks.forEach((taskText) => renderTask(taskText));
  }
});

// ✏️ Add task
submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  const taskInputValue = taskInput.value.trim();

  if (!taskInputValue) {
    alert("Task cannot be empty.");
    return;
  }

  if (tasks.includes(taskInputValue)) {
    alert("Task already exists.");
    return;
  }

  renderTask(taskInputValue); // Add to DOM
  tasks.push(taskInputValue); // Add to array
  saveTasksToLocalStorage(); // Save to localStorage
  taskInput.value = ""; // Clear input
});

// 🗑 Delete task using event delegation
document.addEventListener("click", function (e) {
  if (e.target.closest(".delete")) {
    const taskContainer = e.target.closest(".task-container");
    if (taskContainer) {
      const taskTextElement = taskContainer.querySelector(".task");
      const taskValue = taskTextElement.textContent;

      // Remove from DOM
      taskContainer.remove();

      // Remove from array
      const index = tasks.indexOf(taskValue);
      if (index > -1) {
        tasks.splice(index, 1);
        saveTasksToLocalStorage(); // Update storage after deletion
      }
    }
  }
});

// 💾 Save to localStorage
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 📦 Render a single task to DOM
function renderTask(taskText) {
  const taskHTML = `
    <div class="task-container">
      <p class="task">${taskText}</p>
      <button class="delete">
        <img src="Trash.svg" alt="Delete">
      </button>
    </div>
  `;
  parentElement.insertAdjacentHTML("beforeend", taskHTML);
}

const apiKey = "78b5236044904cf7aff92325252207";
const city = "Ibadan,NG"; // use "City,CountryCode"

async function loadWeather() {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Ibadan&aqi=no`
    );

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();

    // Update temperature
    document.querySelector(".temperature").textContent = Math.round(
      data.current.temp_c
    );

    // Update location
    document.getElementById("weather-location").textContent =
      data.location.name + ", " + data.location.country;

    // Update date
    const date = new Date(data.location.localtime);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
    document.getElementById("weather-date").textContent = formattedDate;

    // Update weather icon
    document.getElementById(
      "weather-img"
    ).src = `https:${data.current.condition.icon}`;
  } catch (err) {
    console.error("Weather load failed:", err);
    alert("Failed to load weather. Check API key or network.");
  }
}

loadWeather();
