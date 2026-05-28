// ==========================================
// MOTIVATIONAL QUOTES
// ==========================================
const quotes = [
  "The expert in anything was once a beginner.",
  "Push yourself because no one else is going to do it for you.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses but to discover our strengths.",
  "The key to success is to focus on goals not obstacles.",
  "Dream bigger. Do bigger.",
  "You are capable of amazing things.",
];

function loadQuote() {
  const day = new Date().getDay();
  document.getElementById("quoteText").textContent = quotes[day % quotes.length];
}

// ==========================================
// SUBJECTS DATABASE
// ==========================================
const subjects = [
  {
    id: "dsa", name: "DSA", icon: "🧠", color: "#7f77dd", bg: "#eeedfe",
    topics: ["Arrays & Strings","Linked Lists","Stacks & Queues","Trees & Binary Trees","Binary Search Tree","Graphs (BFS & DFS)","Dynamic Programming","Sorting Algorithms","Searching Algorithms","Recursion & Backtracking","Hashing","Greedy Algorithms"]
  },
  {
    id: "webdev", name: "Web Dev", icon: "🌐", color: "#1d9e75", bg: "#e1f5ee",
    topics: ["HTML5 Fundamentals","CSS3 & Flexbox & Grid","JavaScript Basics","DOM Manipulation","ES6+ Features","Async JS & Promises","Fetch API & REST APIs","Responsive Design","Git & GitHub","Deployment (Vercel/Netlify)"]
  },
  {
    id: "os", name: "Operating Systems", icon: "💻", color: "#d85a30", bg: "#faece7",
    topics: ["Process & Threads","CPU Scheduling","Memory Management","Virtual Memory & Paging","File Systems","Deadlocks","Synchronization","Inter Process Communication"]
  },
  {
    id: "dbms", name: "DBMS", icon: "🗄️", color: "#378add", bg: "#e6f1fb",
    topics: ["ER Diagrams","Relational Model","SQL Basics","Joins & Subqueries","Normalization","Transactions & ACID","Indexing","NoSQL Basics"]
  },
  {
    id: "cn", name: "Computer Networks", icon: "🔗", color: "#ba7517", bg: "#faeeda",
    topics: ["OSI Model","TCP/IP Model","HTTP & HTTPS","DNS & DHCP","IP Addressing & Subnetting","Routing Protocols","Socket Programming","Network Security Basics"]
  },
  {
    id: "oops", name: "OOP", icon: "📦", color: "#993556", bg: "#fbeaf0",
    topics: ["Classes & Objects","Inheritance","Polymorphism","Encapsulation","Abstraction","Interfaces & Abstract Classes","Design Patterns Basics","SOLID Principles"]
  },
];

// ==========================================
// STATUS & STAR HELPERS
// ==========================================
function getStatus(subjectId, topic) {
  return localStorage.getItem(`prep_${subjectId}_${topic}`) || "not-started";
}

function setStatus(subjectId, topic, status) {
  localStorage.setItem(`prep_${subjectId}_${topic}`, status);
  updateStreak();
  renderAll(currentFilter);
}

function cycleStatus(subjectId, topic) {
  const current = getStatus(subjectId, topic);
  const next = current === "not-started" ? "in-progress"
    : current === "in-progress" ? "done"
    : "not-started";
  setStatus(subjectId, topic, next);
}

function isStarred(subjectId, topic) {
  return localStorage.getItem(`star_${subjectId}_${topic}`) === "1";
}

function toggleStar(subjectId, topic, e) {
  e.stopPropagation();
  const key = `star_${subjectId}_${topic}`;
  const current = localStorage.getItem(key) === "1";
  localStorage.setItem(key, current ? "0" : "1");
  renderAll(currentFilter);
}

// ==========================================
// TIMER
// ==========================================
let timerInterval = null;
let timerSeconds = 0;
let goalHours = 1;
let isRunning = false;

function loadTimer() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("timer_date");
  if (savedDate === today) {
    timerSeconds = parseInt(localStorage.getItem("timer_seconds") || "0");
  } else {
    timerSeconds = 0;
    localStorage.setItem("timer_date", today);
    localStorage.setItem("timer_seconds", "0");
  }
  goalHours = parseInt(localStorage.getItem("timer_goal") || "1");
  document.getElementById("goalSelect").value = goalHours;
  document.getElementById("goalDisplay").textContent = goalHours;
  updateTimerDisplay();
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    document.getElementById("timerBtn").textContent = "▶ Start";
    document.getElementById("timerBtn").classList.remove("running");
  } else {
    timerInterval = setInterval(() => {
      timerSeconds++;
      localStorage.setItem("timer_seconds", timerSeconds);
      updateTimerDisplay();
    }, 1000);
    isRunning = true;
    document.getElementById("timerBtn").textContent = "⏸ Pause";
    document.getElementById("timerBtn").classList.add("running");
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  timerSeconds = 0;
  localStorage.setItem("timer_seconds", "0");
  document.getElementById("timerBtn").textContent = "▶ Start";
  document.getElementById("timerBtn").classList.remove("running");
  updateTimerDisplay();
}

function setGoal() {
  goalHours = parseInt(document.getElementById("goalSelect").value);
  localStorage.setItem("timer_goal", goalHours);
  document.getElementById("goalDisplay").textContent = goalHours;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const h = Math.floor(timerSeconds / 3600);
  const m = Math.floor((timerSeconds % 3600) / 60);
  const s = timerSeconds % 60;
  document.getElementById("timerTime").textContent =
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0");

  const goalSeconds = goalHours * 3600;
  const pct = Math.min((timerSeconds / goalSeconds) * 100, 100);
  document.getElementById("timerBar").style.width = pct + "%";

  if (pct >= 100) {
    document.getElementById("timerBar").style.background = "#1d9e75";
  } else {
    document.getElementById("timerBar").style.background = "#7f77dd";
  }
}

// ==========================================
// RENDER
// ==========================================
let currentFilter = "all";

function filterTopics(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".ftag").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderAll(filter);
}

function renderAll(filter = "all") {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  let totalTopics = 0;
  let totalDone = 0;
  let totalProgress = 0;

  subjects.forEach(subject => {
    const topics = subject.topics;
    let doneCnt = 0;
    let progCnt = 0;

    topics.forEach(t => {
      const s = getStatus(subject.id, t);
      if (s === "done") doneCnt++;
      if (s === "in-progress") progCnt++;
    });

    totalTopics += topics.length;
    totalDone += doneCnt;
    totalProgress += progCnt;

    const pct = Math.round((doneCnt / topics.length) * 100);

    const filteredTopics = topics.filter(t => {
      if (filter === "all") return true;
      return getStatus(subject.id, t) === filter;
    });

    if (filter !== "all" && filteredTopics.length === 0) return;

    const topicsHTML = filteredTopics.map(topic => {
      const status = getStatus(subject.id, topic);
      const starred = isStarred(subject.id, topic);
      return `
        <div class="topic-row" onclick="cycleStatus('${subject.id}', '${topic}')">
          <span class="topic-text ${status === "done" ? "done-text" : ""}">${topic}</span>
          <button class="star-btn" onclick="toggleStar('${subject.id}', '${topic}', event)" title="Mark as important">
            ${starred ? "⭐" : "☆"}
          </button>
          <div class="status-dot dot-${status}" title="Click to change status"></div>
        </div>
      `;
    }).join("");

    const card = document.createElement("div");
    card.className = "subject-card";
    card.innerHTML = `
      <div class="card-top">
        <div class="card-title">
          <div class="card-icon" style="background: ${subject.bg}">${subject.icon}</div>
          ${subject.name}
        </div>
        <span class="card-count">${doneCnt}/${topics.length}</span>
      </div>
      <div class="card-bar-bg">
        <div class="card-bar-fill" style="width: ${pct}%; background: ${subject.color}"></div>
      </div>
      ${topicsHTML}
    `;

    grid.appendChild(card);
  });

  const overallPct = Math.round((totalDone / totalTopics) * 100);
  document.getElementById("overallPct").textContent = overallPct + "%";
  document.getElementById("overallPct2").textContent = overallPct + "%";
  document.getElementById("overallBar").style.width = overallPct + "%";
  document.getElementById("doneCount").textContent = totalDone;
  document.getElementById("progressCount").textContent = totalProgress;
  document.getElementById("notStartedCount").textContent = totalTopics - totalDone - totalProgress;
}

// ==========================================
// STREAK
// ==========================================
function updateStreak() {
  const today = new Date().toDateString();
  const lastActive = localStorage.getItem("prep_last_active");
  let streak = parseInt(localStorage.getItem("prep_streak") || "0");

  if (lastActive === today) {
  } else if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
    streak++;
    localStorage.setItem("prep_streak", streak);
  } else {
    streak = 1;
    localStorage.setItem("prep_streak", streak);
  }

  localStorage.setItem("prep_last_active", today);
  document.getElementById("streakCount").textContent = streak;
}

// ==========================================
// INIT
// ==========================================
function init() {
  loadQuote();
  loadTimer();
  const streak = localStorage.getItem("prep_streak") || 0;
  document.getElementById("streakCount").textContent = streak;
  renderAll();
}

init();


// ==========================================
// PROGRESS REPORT
// ==========================================
function openReport() {
  const reportBody = document.getElementById("reportBody");

  let totalTopics = 0;
  let totalDone = 0;
  let subjectStats = [];

  subjects.forEach(subject => {
    let doneCnt = 0;
    subject.topics.forEach(t => {
      totalTopics++;
      if (getStatus(subject.id, t) === "done") doneCnt++;
    });
    totalDone += doneCnt;
    const pct = Math.round((doneCnt / subject.topics.length) * 100);
    subjectStats.push({ ...subject, doneCnt, pct });
  });

  const overallPct = Math.round((totalDone / totalTopics) * 100);
  const best = [...subjectStats].sort((a, b) => b.pct - a.pct)[0];
  const worst = [...subjectStats].sort((a, b) => a.pct - b.pct)[0];

  const remaining = totalTopics - totalDone;
  const streak = parseInt(localStorage.getItem("prep_streak") || "0");
  const donePerDay = streak > 0 ? Math.max(1, Math.round(totalDone / streak)) : 1;
  const daysLeft = remaining > 0 ? Math.ceil(remaining / donePerDay) : 0;

  const subjectRowsHTML = subjectStats.map(s => `
    <div class="report-subject-row">
      <span class="report-subject-icon">${s.icon}</span>
      <span class="report-subject-name">${s.name}</span>
      <div class="report-subject-bar-bg">
        <div class="report-subject-bar-fill" style="width: ${s.pct}%; background: ${s.color}"></div>
      </div>
      <span class="report-subject-pct">${s.pct}%</span>
    </div>
  `).join("");

  reportBody.innerHTML = `
    <div class="report-score-big">
      <div class="report-score-num">${overallPct}%</div>
      <div class="report-score-label">Overall interview readiness</div>
      <div class="report-bar-bg">
        <div class="report-bar-fill" style="width: ${overallPct}%"></div>
      </div>
      <div style="font-size: 13px; color: #888;">${totalDone} of ${totalTopics} topics completed</div>
    </div>

    <div class="report-section-title">Subject Breakdown</div>
    ${subjectRowsHTML}

    <div class="report-section-title">Highlights</div>
    <div class="highlight-cards">
      <div class="highlight-card best">
        <div class="highlight-card-label">💪 Strongest</div>
        <div class="highlight-card-name">${best.name}</div>
        <div class="highlight-card-pct">${best.pct}% done</div>
      </div>
      <div class="highlight-card worst">
        <div class="highlight-card-label">⚠️ Needs Work</div>
        <div class="highlight-card-name">${worst.name}</div>
        <div class="highlight-card-pct">${worst.pct}% done</div>
      </div>
    </div>

    <div class="report-section-title">Estimated Completion</div>
    <div class="pace-box">
      ${daysLeft === 0
        ? "🎉 You have completed all topics! You are ready to crack interviews!"
        : `At your current pace you will complete all topics in approximately <strong>${daysLeft} day${daysLeft > 1 ? "s" : ""}</strong>. Keep going! 🚀`
      }
    </div>
  `;

  document.getElementById("reportModal").classList.remove("hidden");
}

function closeReport() {
  document.getElementById("reportModal").classList.add("hidden");
}