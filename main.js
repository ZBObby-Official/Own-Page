const listEl     = document.getElementById("file-list");
const welcomeEl  = document.getElementById("welcome");
const detailEl   = document.getElementById("detail");
const dlBtn      = document.getElementById("download-btn");

let selectedIndex = -1;
const cards = [];

// 渲染文件卡片
files.forEach((f, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img class="card-cover" src="${f.cover}" alt="">
    <div class="card-text">
      <div class="card-name">${f.name}</div>
      <div class="card-author">${f.author}</div>
    </div>
    <div class="card-size">${f.size}</div>
  `;
  card.addEventListener("click", () => select(i));
  listEl.appendChild(card);
  cards.push(card);
});

// 选中某个文件
function select(i) {
  selectedIndex = i;
  cards.forEach((c, idx) => c.classList.toggle("active", idx === i));

  const f = files[i];
  document.getElementById("d-cover").src = f.coverHD;
  document.getElementById("d-song").textContent    = f.name;
  document.getElementById("d-artist").textContent  = f.author;
  document.getElementById("d-level").textContent   = f.level;
  document.getElementById("d-charter").textContent = f.charter;
  document.getElementById("d-date").textContent    = f.date;
  document.getElementById("d-desc").textContent    = f.desc;
  dlBtn.href = f.file;

  welcomeEl.classList.add("hidden");
  detailEl.classList.remove("hidden");
  detailEl.classList.remove("detail-fade");
void detailEl.offsetWidth;      // 强制回流，让浏览器“忘记”上一次动画
detailEl.classList.add("detail-fade");
}

// 键盘上下选择
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("hidden")) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (selectedIndex === -1) {
      select(e.key === "ArrowDown" ? 0 : files.length - 1);
      return;
    }
    let next = selectedIndex + (e.key === "ArrowDown" ? 1 : -1);
    next = Math.max(0, Math.min(files.length - 1, next));
    select(next);
    cards[next].scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

// 渐隐渐显：用 IntersectionObserver 监听进出屏幕
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle("visible", entry.isIntersecting);
  });
}, { threshold: 0.15 });

cards.forEach((c) => io.observe(c));
// ---------- 灯箱 ----------
const lightbox   = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const dCover     = document.getElementById("d-cover");

// 点高清图打开灯箱
dCover.addEventListener("click", () => {
  if (!dCover.src) return;
  lightboxImg.src = dCover.src;
  lightbox.classList.remove("hidden");
});

// 点灯箱任意处关闭
lightbox.addEventListener("click", () => {
  lightbox.classList.add("hidden");
  lightboxImg.src = "";
});

// Esc 关闭
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  }
});