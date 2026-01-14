//===DOM取得===//
//--todo.html--//
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
const tagSelect = document.getElementById("tagSelect");


//===データ定義===//

//===状況管理===//
let todos = JSON.parse(localStorage.getItem("todos")) || [];




//===関数定義===//
//todoの一覧描画
function renderTodos() {
  todoList.innerHTML = "";
  todos
  .filter(todo => !todo.trashed)
  .forEach(todo => {
    const li = document.createElement("li");
    li.className = "todo-item";
    if(todo.done)li.classList.add("done-anim")

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
// ===== スワイプ完了（スマホUX）=====
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    const SWIPE_THRESHOLD = 80;

    li.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
    li.classList.add("swiping");
    });
    li.addEventListener("touchmove", e => {
    if (!isSwiping) return;

    currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (diffX > 0) {
        li.style.transform = `translateX(${diffX}px)`;

        if (diffX > SWIPE_THRESHOLD) {
        li.classList.add("swipe-ready");
        } else {
        li.classList.remove("swipe-ready");
        }
    }
    });
    li.addEventListener("touchend", () => {
    li.classList.remove("swiping");

    const diffX = currentX - startX;

    if (diffX > SWIPE_THRESHOLD) {
        handleDone(todo, li);
    } else {
        li.style.transform = "translateX(0)";
        li.classList.remove("swipe-ready");
    }

    isSwiping = false;
    startX = 0;
    currentX = 0;
    });
// ★ お気に入り切り替え
    li.querySelector(".star-btn").addEventListener("click", () => {
      todo.favorite = !todo.favorite;
      saveTodos();
      renderTodos();
    });
    li.querySelector(".done-btn").addEventListener("click", () => {
        handleDone(todo, li);
    });
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
  saveTodos();
  li.classList.add("done-anim");
  // ゴミ箱へ
  setTimeout(() => {
    todo.trashed = true;
    saveTodos();
    renderTodos();
  }, 600); 
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



//===初期表示===//
renderTodos();