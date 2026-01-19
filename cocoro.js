//===DOM取得===//
//day-catch
const todoDate = document.getElementById("todoDate");
//text-area
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");

//===localStorage===//
let todos = JSON.parse(localStorage.getItem("todo")) || [];

//===日付キー===//
const selectedDateKey = getTodayKey();



//===描画関数===//
function renderTodoDate(){
    const date = new Date(selectedDateKey);
    const text = `${date.getFullYear()}年
                  ${date.getMonth()+1}月
                  ${date.getDate()}日`;
    document.getElementById("todoDate").textContent = text;
}
function getTodayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

//===EVENT===//






renderTodoDate();