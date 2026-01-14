//===DOM取得===//
//--todo.html--//
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const tagSelect = document.getElementById("tagSelect");



//===データ定義===//

//===状況管理===//
//--todo.html--//
let todos = JSON.parse(localStorage.getItem("todos")) || [];



//===関数定義===//
//todoの一覧描画
function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach(todo => {
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
      <button class="done-btn">
        ✓
      </button>
    `;

    // ★ お気に入り切り替え
    li.querySelector(".star-btn").addEventListener("click", () => {
      todo.favorite = !todo.favorite;
      saveTodos();
      renderTodos();
    });
    li.querySelector(".done-btn").addEventListener("click", () => {
        todo.done = !todo.done;
        saveTodos();
        renderTodos();
    });


    todoList.appendChild(li);
  });
}

//todosave
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
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
    done: false
  };

  todos.unshift(todo);
  saveTodos();
  todoInput.value = "";
  renderTodos();
});



//===初期表示===//
renderTodos();