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
let currentDate = new Date();
let selectedDateKey = getTodayKey();
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
}
function renderLogs(){
    todoList.innerHTML = "";
    const logs = cocoroData[selectedDateKey]?.logs||[];

    logs.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
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
        cell.textContent = day;

        cell.addEventListener("click", () => {
            selectDate(dateKey);
        });

        calendarGrid.appendChild(cell);
     }
}
function selectDate(dateKey){
    selectedDateKey = dateKey;

    if(!cocoroData[selectedDateKey]){
        cocoroData[selectedDateKey]={
            log:[],
            mood:null
        };
    }

    renderTodoDate();
    renderLogs();
}




//===EVENT===//
addTodoBtn.addEventListener("click",()=>{
    const text = todoInput.value.trim();
    if(!text) return;

    const logs = cocoroData[selectedDateKey].logs;
    if(todos[selectedDateKey].length >= 3){
        alert("今日はここまで🌷");
        return;
    }
    logs.push(text);
    saveData();
    todoInput.value = "";
    renderLogs();
});
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