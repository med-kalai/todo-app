// Todo App - Vanilla JS
// - Add tasks
// - Toggle complete
// - Delete tasks
// - Persist to localStorage

(function () {
  "use strict";

  /**
   * Storage keys and helpers
   */
  const STORAGE_KEY = "todos-v1";

  function loadTodosFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      return [];
    }
  }

  function saveTodosToStorage(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  /**
   * DOM elements
   */
  const formElement = document.getElementById("todo-form");
  const inputElement = document.getElementById("todo-input");
  const listElement = document.getElementById("todo-list");
  const countElement = document.getElementById("todo-count");
  const clearCompletedButton = document.getElementById("clear-completed");

  /**
   * Application state
   */
  let todos = loadTodosFromStorage();

  /**
   * Rendering
   */
  function createCheckboxIcon() {
    // SVG check icon, styled/animated in CSS
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "currentColor");
    svg.classList.add("checkbox__icon");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M20.285 6.709a1 1 0 0 1 0 1.414l-9.19 9.189a1 1 0 0 1-1.414 0L3.715 10.35a1 1 0 1 1 1.414-1.415l5.24 5.241 8.483-8.484a1 1 0 0 1 1.414 0z");
    svg.appendChild(path);
    return svg;
  }

  function renderTodoItem(todo) {
    const listItem = document.createElement("li");
    listItem.className = "todo-item";
    listItem.dataset.id = String(todo.id);

    const label = document.createElement("label");
    label.className = "todo-item__label";

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "checkbox";
    checkbox.setAttribute("role", "checkbox");
    checkbox.setAttribute("aria-checked", String(Boolean(todo.completed)));
    checkbox.setAttribute("aria-label", todo.completed ? "Mark as not completed" : "Mark as completed");
    checkbox.appendChild(createCheckboxIcon());
    if (todo.completed) {
      checkbox.classList.add("is-checked");
    }

    const text = document.createElement("span");
    text.className = "todo-text" + (todo.completed ? " todo-text--done" : "");
    text.textContent = todo.text;

    label.appendChild(checkbox);
    label.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-btn";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.innerHTML = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 7h12m-9 0V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7m3 4v6m4-6v6\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\"/></svg>";

    actions.appendChild(deleteButton);

    listItem.appendChild(label);
    listItem.appendChild(actions);

    return listItem;
  }

  function renderTodos() {
    listElement.innerHTML = "";
    if (!todos.length) {
      const empty = document.createElement("li");
      empty.className = "todo-item";
      empty.style.opacity = "0.8";
      empty.innerHTML = "<span class=\"todo-text\">No tasks yet. Add your first one above! ✨</span>";
      listElement.appendChild(empty);
    } else {
      for (const todo of todos) {
        listElement.appendChild(renderTodoItem(todo));
      }
    }
    updateCount();
  }

  function updateCount() {
    const remaining = todos.filter(t => !t.completed).length;
    const total = todos.length;
    countElement.textContent = total
      ? `${remaining} of ${total} remaining`
      : "";
  }

  /**
   * Actions
   */
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false
    };
    todos.unshift(newTodo);
    saveTodosToStorage(todos);
    renderTodos();
  }

  function toggleTodo(id) {
    let changed = false;
    todos = todos.map(t => {
      if (t.id === id) {
        changed = true;
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    if (!changed) return;
    saveTodosToStorage(todos);
    renderTodos();
  }

  function deleteTodo(id) {
    const next = todos.filter(t => t.id !== id);
    if (next.length === todos.length) return;
    todos = next;
    saveTodosToStorage(todos);
    renderTodos();
  }

  function clearCompleted() {
    const next = todos.filter(t => !t.completed);
    if (next.length === todos.length) return;
    todos = next;
    saveTodosToStorage(todos);
    renderTodos();
  }

  /**
   * Event handlers
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    addTodo(inputElement.value);
    inputElement.value = "";
    inputElement.focus();
  }

  function handleListClick(event) {
    const target = event.target;
    // Find the closest list item to derive the id
    const item = target.closest(".todo-item");
    if (!item) return;
    const id = Number(item.dataset.id);

    // Toggle via checkbox/button
    if (target.closest(".checkbox")) {
      toggleTodo(id);
      return;
    }

    // Delete
    if (target.closest(".icon-btn")) {
      deleteTodo(id);
      return;
    }
  }

  /**
   * Init
   */
  function init() {
    formElement.addEventListener("submit", handleFormSubmit);
    listElement.addEventListener("click", handleListClick);
    clearCompletedButton.addEventListener("click", clearCompleted);
    renderTodos();
  }

  // Start the app after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


