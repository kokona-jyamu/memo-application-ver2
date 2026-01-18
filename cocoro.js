const todoDate = document.getElementById("todoDate");
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");

const editModal = document.getElementById("editModal");
const editTextarea = document.getElementById("editTextarea");
const saveEditBtn = document.getElementById("saveEditBtn");
const saveToast = document.getElementById("saveToast");

const calendarGrid = document.getElementById("calendarGrid");
const calendarTitle = document.getElementById("calendarTitle");
const tagSelect = document.getElementById("tagSelect");


//===状況管理===//
let selectedDateKey = getTodayKey();
let currentMonth = new Date();
let cocoroData = JSON.parse(localStorage.getItem("cocoroData")) || {};
let editingLog = null;

//===描写関数===//
//今日を取得する関数（共通）
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
//日付表示専用関数
function renderTodoDate() {
  const date = new Date(selectedDateKey);
  const text = `${date.getFullYear()}年 ${date.getMonth() + 1}月 ${date.getDate()}日`;
  document.getElementById("todoDate").textContent = text;
}
//日付更新を一元管理する関数
function selectDate(dateKey) {
  selectedDateKey = dateKey;
  renderTodoDate();
  renderLogs();
  updateMoodUI();
}
// === ログ表示（最大3） ===
function renderLogs() {
  todoList.innerHTML = "";

  const logs = cocoroData[selectedDateKey]?.logs || [];

  logs.forEach(log => {
    const li = document.createElement("li");
    li.className = "todo-item";

    const span = document.createElement("span");
    span.className = "log-text";
    span.textContent = log.text;

    span.addEventListener("click", () => {
      openEditModal(log);
    });

    li.appendChild(span);
    todoList.appendChild(li);
  });
}
function updateMoodUI() {
  const mood = cocoroData[selectedDateKey]?.mood;

  document.querySelectorAll(".mood-tabs button").forEach(btn => {
    const isActive = btn.dataset.mood === mood;
    btn.classList.toggle("active", isActive);
  });
}
//モーダルを開く際の関数
function openEditModal(log) {
  editingLog = log;
  editTextarea.value = log.text;
  editModal.classList.remove("hidden");
  editTextarea.focus();
}
function showSaveToast() {
  saveToast.classList.remove("hidden");
  saveToast.classList.add("show");

  setTimeout(() => {
    saveToast.classList.remove("show");
    saveToast.classList.add("hidden");
  }, 1500);
}

//カレンダー
function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  calendarTitle.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 空白
  for (let i = 0; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    
    const mood = cocoroData[dateKey]?.mood;
    const moodIcon = mood ? moodToIcon(mood) : "";
    
    cell.innerHTML = `
      <div class="day-num">${day}</div>
      <div class="mood">${moodIcon}</div>
    `;

    cell.addEventListener("click", () => {
      selectDate(dateKey);
    });

    calendarGrid.appendChild(cell);
  }
}
function moodToIcon(mood) {
  if (mood === "sun") return "🌞";
  if (mood === "cloud") return "🌫️";
  if (mood === "spiral") return "🌀";
  return "";
}
function loadCocoroOfDay(dateKey) {
  console.log("この日の記録:", cocoroData[dateKey]);
}



//===イベント===//
addTodoBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  if (!text) return;

  if (!cocoroData[selectedDateKey]) {
    cocoroData[selectedDateKey] = { logs: [], mood: null };
  }

  const logs = cocoroData[selectedDateKey].logs;

  // ３つ以上超えそうになったら
  if (logs.length >= 3) {
    alert("今日はここまでにしよう");
    return;
  }

  logs.push({
    id: Date.now(),
    text
  });

  localStorage.setItem("cocoroData", JSON.stringify(cocoroData));
  todoInput.value = "";
  renderLogs();
});
//編集後保存ボタン
saveEditBtn.addEventListener("click", () => {
  if (!editingLog) return;

  editingLog.text = editTextarea.value.trim();
  localStorage.setItem("cocoroData", JSON.stringify(cocoroData));

  editModal.classList.add("hidden");
  showSaveToast();
  renderLogs();

  editingLog = null;
});
//グレー部分タップで編集画面閉じる（UX）
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.classList.add("hidden");
    editingLog = null;
  }
});





  
document.querySelectorAll(".mood-tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;

    if (!cocoroData[selectedDateKey]) {
      cocoroData[selectedDateKey] = { logs: [], mood: null };
    }

    cocoroData[selectedDateKey].mood = mood;
    localStorage.setItem("cocoroData", JSON.stringify(cocoroData));

    updateMoodUI();
    renderCalendar();
  });
});




document.getElementById("prevMonth").addEventListener("click", () => {
  currentMonth.setMonth(currentMonth.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentMonth.setMonth(currentMonth.getMonth() + 1);
  renderCalendar();
});


//===初期表示===//
renderCalendar();
renderLogs();
selectDate(getTodayKey());

