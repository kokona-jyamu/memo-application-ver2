const memoInput = document.getElementById("memoInput");
const saveBtn = document.getElementById("saveBtn");
const logList = document.getElementById("logList");

const modal = document.getElementById("modal");
const modalTextarea = document.getElementById("modalTextarea");
const modalSave = document.getElementById("modalSave");
const modalClose = document.getElementById("modalClose");


// ログ取得
let memos = JSON.parse(localStorage.getItem("hibiMemos")) || [];
let currentEditId = null;


// 日時フォーマット
function formatDate(date) {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ` +
         `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
}

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

    // クリックでモーダルを開く
    li.addEventListener("click", () => {
      currentEditId = memo.id;
      modalTextarea.value = memo.text;
      modal.style.display = "flex";
    });

    // 削除
    li.querySelector(".delete-btn").addEventListener("click", e => {
      e.stopPropagation();
      memos = memos.filter(m => m.id !== memo.id);
      localStorage.setItem("hibiMemos", JSON.stringify(memos));
      renderLogs();
    });

    logList.appendChild(li);
  });
}

modalSave.addEventListener("click", () => {
  const memo = memos.find(m => m.id === currentEditId);
  if (memo) {
    memo.text = modalTextarea.value;
    localStorage.setItem("hibiMemos", JSON.stringify(memos));
    renderLogs();
  }
  modal.style.display = "none";
});

modalClose.addEventListener("click", () => {
  modal.style.display = "none";
});


// 初期表示
renderLogs();




