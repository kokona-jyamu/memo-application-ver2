//===DOM取得===//
const memoInput = document.getElementById("memoInput");
const saveBtn = document.getElementById("saveBtn");
const logList = document.getElementById("logList");

const modal = document.getElementById("modal");
const modalTextarea = document.getElementById("modalTextarea");
const modalSave = document.getElementById("modalSave");
const modalClose = document.getElementById("modalClose");

const toast = document.getElementById("toast");
const LONG_PRESS_TIME = 500; 

const recommendType = document.querySelector(".recommend-type");
const recommendItem = document.querySelector(".recommend-item");
const recommendToggle = document.getElementById("recommendToggle");
const recommendSection = document.querySelector(".recommend-section");




//===データ定義===//
const recommends = [
  {
    type: "BOOK",
    text: "7つの習慣<br>スティーブン・R・コヴィー"
  },
  {
    type: "MOVIE",
    text: "コンフィデンスマン<br>▶ Amazon Prime"
  },
  {
    type: "BOOK",
    text: "嫌われる勇気<br>岸見一郎"
  },
  {
    type: "MOVIE",
    text: "ショーシャンクの空に"
  }
];



// ===状況管理=== //
let memos = JSON.parse(localStorage.getItem("hibiMemos")) || [];
let currentEditId = null;
let lastDateKey = getTodayKey();
const recommendEnabled =
  JSON.parse(localStorage.getItem("recommendEnabled")) ?? true;
recommendToggle.checked = recommendEnabled;




// === 関数定義　===//

// 日時フォーマット
function formatDate(date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ` +
         `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}
// 一覧描画
function renderLogs() {
  logList.innerHTML = "";

  memos.forEach(memo => {
    const li = document.createElement("li");
    li.classList.add("log-item");
    li.innerHTML = `
      <div class="log-text">${memo.text}</div>
      <div class="log-date">${memo.date}</div>
      <button class="delete-btn">×</button>
    `;

    //長押し編集について
    let pressTimer;

    const startPress = () => {
      li.classList.add("pressing");

      pressTimer = setTimeout(() => {
        li.classList.remove("pressing");
        currentEditId = memo.id;
        modalTextarea.value = memo.text;
        modal.classList.add("show");
      }, LONG_PRESS_TIME);
    };

    const cancelPress = () => {
      clearTimeout(pressTimer);
      li.classList.remove("pressing");
    };

    //スマホ
    li.addEventListener("touchstart", startPress);
    li.addEventListener("touchend", cancelPress);
    li.addEventListener("touchmove", cancelPress);

    // PC
    li.addEventListener("mousedown", startPress);
    li.addEventListener("mouseup", cancelPress);
    li.addEventListener("mouseleave", cancelPress);
    // ===== 長押し編集（ここまで）=====

    // 削除ボタン
    li.querySelector(".delete-btn").addEventListener("click", e => {
      e.stopPropagation();
      memos = memos.filter(m => m.id !== memo.id);
      localStorage.setItem("hibiMemos", JSON.stringify(memos));
      renderLogs();
    });

    logList.appendChild(li);
  });
}
//toastに関するJS
function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}
//ランダム表示基準日時
function getTodayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}
//ランダム表示について
function renderRecommend() {
  const enabled =
    JSON.parse(localStorage.getItem("recommendEnabled")) ?? true;

    if (!enabled) {
    recommendSection.classList.add("is-off");
    return;
  }

  recommendSection.classList.remove("is-off");

  const todayKey = getTodayKey();
  const saved = JSON.parse(localStorage.getItem("dailyRecommend"));

  // すでに今日のおすすめがある場合
  if (saved && saved.date === todayKey) {
    recommendType.textContent = saved.data.type;
    recommendItem.innerHTML = saved.data.text;
    return;
  }

  // なければランダム抽選
  const random = recommends[Math.floor(Math.random() * recommends.length)];
  // 保存
  localStorage.setItem(
    "dailyRecommend",
    JSON.stringify({
      date: todayKey,
      data: random
    })
  );
  // 表示
  recommendType.textContent = random.type;
  recommendItem.innerHTML = random.text;
}
function updateRecommendView(enabled) {
  const section = document.querySelector(".recommend-section");

  if (enabled) {
    section.classList.remove("is-off");
  } else {
    section.classList.add("is-off");
  }
}
//日超えたらランダム変更
function watchDateChange() {
  setInterval(() => {
    const todayKey = getTodayKey();

    if (todayKey !== lastDateKey) {
      lastDateKey = todayKey;
      renderRecommend(); 
    }
  }, 60000); // 1分ごと
}







// ===　イベント　=== //

// 保存
saveBtn.addEventListener("click", () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const memo = {
    id: Date.now(),
    text,
    date: new Date().toLocaleString()
  };

  memos.unshift(memo);
  localStorage.setItem("hibiMemos", JSON.stringify(memos));
  memoInput.value = "";
  renderLogs();
});
//modalについて
modalSave.addEventListener("click", () => {
  const memo = memos.find(m => m.id === currentEditId);
  if (memo) {
    memo.text = modalTextarea.value;
    localStorage.setItem("hibiMemos", JSON.stringify(memos));
    renderLogs();
    showToast(); 
  }
  modal.classList.remove("show");
});
modalClose.addEventListener("click", () => {
  modal.classList.remove("show");
});
//おすすめ
recommendToggle.addEventListener("change", () => {
  const enabled = recommendToggle.checked;
  // 状態を保存（1回だけ）
  localStorage.setItem("recommendEnabled",JSON.stringify(enabled));
  // 表示切り替え
  updateRecommendView(enabled);
  // ONのときだけおすすめを描画
  if (enabled) {renderRecommend();}
});
recommendSection.addEventListener("click", () => {
  const enabled =
    JSON.parse(localStorage.getItem("recommendEnabled")) ?? true;

  localStorage.setItem(
    "recommendEnabled",
    JSON.stringify(!enabled)
  );

  renderRecommend();
});



// === 初期表示 === //
renderLogs();
renderRecommend();
watchDateChange();
updateRecommendView(recommendEnabled);



