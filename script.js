/*memo-saved*/
const memoInput = document.getElementById("memoInput");
const saveBtn = document.getElementById("saveBtn");
const savedAt = document.getElementById("savedAt");

// 保存処理
saveBtn.addEventListener("click", () => {
  const text = memoInput.value.trim();
  if (!text) return;

  const now = new Date();
  const formatted =
    `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ` +
    `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

  localStorage.setItem("hibiMemo", text);
  localStorage.setItem("hibiSavedAt", formatted);

  saveBtn.classList.add("saved");
  savedAt.textContent = `保存日時：${formatted}`;
});

// 再読み込み時
const savedMemo = localStorage.getItem("hibiMemo");
const savedTime = localStorage.getItem("hibiSavedAt");

if (savedMemo) {
  memoInput.value = savedMemo;
  saveBtn.classList.add("saved");
}

if (savedTime) {
  savedAt.textContent = `保存日時：${savedTime}`;
}

