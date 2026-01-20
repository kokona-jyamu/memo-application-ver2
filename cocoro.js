//===DOM取得===//
//day-catch
const todoDate = document.getElementById("todoDate");
//textarea
const todoInput = document.getElementById("todoInput");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoList = document.getElementById("todoList");
//calendar
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");





//===localStorage===//
//calendar
let selectedDateKey = getTodayKey();
let currentMonth = new Date();
let cocoroData = JSON.parse(localStorage.getItem("cocoroData"))||{};




//===描画関数===//
//common
function getTodayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function saveData(){
    localStorage.setItem("cocoroData",JSON.stringify(cocoroData));
}
//display
//todo
function renderTodoDate(){
    const d = new Date(selectedDateKey);
    const text = `${d.getFullYear()}年 ${d.getMonth()+1}月 ${d.getDate()}日`;
    todoDate.textContent = text;
}
function renderLogs() {
  todoList.innerHTML = "";

  const logs = cocoroData[selectedDateKey]?.logs || [];

  logs.forEach(log => {
    const li = document.createElement("li");
    li.classList.add("cocoron-log-item");

    const text =
      typeof log === "string"
        ? log
        : log.text ?? "";

    li.innerHTML = `
      <div class="cocoron-log-bubble">
        ${text}
      </div>
    `;

    todoList.appendChild(li);
  });
}


//calendar
function renderCalendar(){
    calendarGrid.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    calendarTitle.textContent = `${year}年 ${month+1}月`;

    const firstDay = new Date(year,month,1).getDay();
    const lastDate = new Date(year,month+1,0).getDate();

    for(let i =0 ; i < firstDay ; i++){
        calendarGrid.appendChild(document.createElement("div"));
    }

    for(let day = 1 ; day <= lastDate ; day++){
        const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.innerHTML = `
        <div class="day-num">${day}</div>
        <div class="mood">${getMoodIcon(dateKey)}</div>`;

        cell.addEventListener("click", () => {
            selectDate(dateKey);
        });

        calendarGrid.appendChild(cell);
     }
}
function selectDate(dateKey){
    selectedDateKey = dateKey;

    if(!cocoroData[selectedDateKey]){
        cocoroData[selectedDateKey]={logs: [],mood: null};
    }
    renderTodoDate();
    renderLogs();
    updateMoodUI();
}
//mood
function getMoodIcon(dateKey){
    const mood = cocoroData[dateKey]?.mood;
    if(mood === "sun")return"☀️";
    if(mood === "cloud")return"☁️";
    if(mood === "spiral")return"🌀";
    return"";
}
document.querySelectorAll(".mood-tabs button").forEach(btn =>{
    btn.addEventListener("click",() => {
        const mood = btn.dataset.mood;

    if(!cocoroData[selectedDateKey]){
        cocoroData[selectedDateKey]={logs:[],mood:null};
    }

    cocoroData[selectedDateKey].mood = mood;
    saveData();

    updateMoodUI();
    renderCalendar();
    });
});
function updateMoodUI(){
    const mood = cocoroData[selectedDateKey]?.mood;

    document.querySelectorAll(".mood-tabs button").forEach(btn =>{
        btn.classList.toggle("active",btn.dataset.mood === mood);
    });
}





//===EVENT===//
//textarea
addTodoBtn.addEventListener("click",()=>{
    const text = todoInput.value.trim();
    if(!text) return;

    if(!cocoroData[selectedDateKey]){
    cocoroData[selectedDateKey]={logs: [],mood: null};
    }

    if(cocoroData[selectedDateKey].logs.length >= 3){
        alert("今日はここまで🌷");
        return;
    }

    cocoroData[selectedDateKey].logs.push(text);
    saveData();

    todoInput.value = "";
    renderLogs();
    renderCalendar();
});
//calendar
prevMonth.addEventListener("click", ()=>{
    currentMonth.setMonth(currentMonth.getMonth()-1);
    renderCalendar();
});
nextMonth.addEventListener("click", ()=>{
    currentMonth.setMonth(currentMonth.getMonth()+1);
    renderCalendar();
});





//===just===//
selectDate(getTodayKey());
renderCalendar();