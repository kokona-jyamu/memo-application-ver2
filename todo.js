//===DOM取得===//
//--todo.html--//
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const tagSelect = document.getElementById("tagSelect");
const trashToggle = document.getElementById("trashToggle");
const trashList = document.getElementById("trashList");



//===データ定義===//
const TRASH_LIMIT = 1000 * 60 * 60 * 24 * 30;

//===状況管理===//
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let isTrashMode = false;





//===関数定義===//
//todoの一覧描画
function renderTodos() {
  todoList.innerHTML = "";

  todos.filter(t => !t.trashed).forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <button class="star-btn">
        <i class="${todo.favorite ? "fa-solid" : "fa-regular"} fa-star"></i>
      </button>

      <span class="todo-tag">${todo.tag}</span>

      <span class="todo-text ${todo.done ? "done" : ""}">
        ${todo.text}
      </span>

      <button class="done-btn">✓</button>
    `;
    // ⭐
    li.querySelector(".star-btn").addEventListener("click", () => {
      todo.favorite = !todo.favorite;
      saveTodos();
      renderTodos();
    });

    // ✓
    li.querySelector(".done-btn").addEventListener("click", () => {
      handleDone(todo, li);
    });

    setupSwipe(li, todo);

    todoList.appendChild(li);
  });
}
//todosave
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
//完了時のアニメーション
function handleDone(todo, li) {
  todo.done = true;
  li.classList.add("done-anim");
  // ゴミ箱へ
  setTimeout(() => {
  moveToTrash(todo);
  }, 600); 
}
function moveToTrash(todo) {
  todo.trashed = true;
  todo.trashedAt = Date.now(); // ゴミ箱に入れた日時
  saveTodos();
  renderTodos();
}
function cleanupTrash() {
  const now = Date.now();

  todos = todos.filter(todo => {
    if (!todo.trashed) return true;
    return now - todo.trashedAt < TRASH_LIMIT;
  });

  saveTodos();
}
function renderTrash() {
  trashList.innerHTML = "";

  todos.filter(t => t.trashed).forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item trash-item";

    li.innerHTML = `
    <span class="todo-text done">
        ${todo.text}
    </span>
    <button class="restore-btn" title="復元">
        <i class="fa-solid fa-rotate-left"></i>
    </button>
    `;

    li.querySelector(".restore-btn").addEventListener("click", () => {
      todo.trashed = false;
      todo.done = false;
      todo.trashedAt = null;
      saveTodos();
      renderTodos();
      renderTrash();
    });

    trashList.appendChild(li);
  });
}
function setupSwipe(li, todo) {
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  const SWIPE_THRESHOLD = 80;

  li.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  li.addEventListener("touchmove", e => {
    if (!isSwiping) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (diff > 0) li.style.transform = `translateX(${diff}px)`;
  });

  li.addEventListener("touchend", () => {
    if (currentX - startX > SWIPE_THRESHOLD) {
      handleDone(todo, li);
    } else {
      li.style.transform = "translateX(0)";
    }
    isSwiping = false;
  });
}





//===イベント===//
//todo-add
addTodoBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (!text) return;

  const todo = {
    id: Date.now(),
    text,
    favorite: false,
    tag: tagSelect.value,
    done: false,
    trashed: false
  };

  todos.unshift(todo);
  saveTodos();
  todoInput.value = "";
  renderTodos();
});
trashToggle.addEventListener("click", () => {
  let isTrashOpen = false;
  isTrashOpen = !isTrashOpen;
  trashList.classList.toggle("hidden", !isTrashOpen);
  if (isTrashOpen) renderTrash();
});




//===初期表示===//
cleanupTrash();
renderTodos();
