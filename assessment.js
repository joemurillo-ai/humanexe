const assessmentKey = "human-exe-assessment-v02-current";
const legacyAssessmentKey = "human-exe-assessment-v01";
const historyKey = "human-exe-assessment-history-v02";
const maxHistoryEntries = 12;

const categories = {
  recovery: {
    label: "Recovery",
    recommendation: "Protect sleep, reduce late-day load, and schedule one recovery protocol today.",
  },
  training: {
    label: "Training",
    recommendation: "Match training intensity to readiness and bias toward consistency over hero sessions.",
  },
  fuel: {
    label: "Fuel",
    recommendation: "Anchor protein, hydration, and steady energy before optimizing supplements.",
  },
  focus: {
    label: "Focus",
    recommendation: "Create one protected deep-work block and remove the highest-friction distraction.",
  },
  purpose: {
    label: "Purpose",
    recommendation: "Reconnect today's execution to a clear mission, constraint, and next decision.",
  },
};

const questions = [
  {
    id: "recovery-1",
    category: "recovery",
    text: "I wake up with stable energy and minimal sleep inertia.",
  },
  {
    id: "recovery-2",
    category: "recovery",
    text: "My sleep schedule is consistent across most nights.",
  },
  {
    id: "recovery-3",
    category: "recovery",
    text: "I have a reliable downshift routine before bed.",
  },
  {
    id: "recovery-4",
    category: "recovery",
    text: "I recover well enough to repeat high-quality output the next day.",
  },
  {
    id: "training-1",
    category: "training",
    text: "My training plan matches my current readiness and workload.",
  },
  {
    id: "training-2",
    category: "training",
    text: "I train consistently without swinging between extremes.",
  },
  {
    id: "training-3",
    category: "training",
    text: "I include strength, cardiovascular work, and mobility across the week.",
  },
  {
    id: "training-4",
    category: "training",
    text: "I adjust intensity when stress, sleep, or soreness changes.",
  },
  {
    id: "fuel-1",
    category: "fuel",
    text: "My first meal supports steady energy and appetite control.",
  },
  {
    id: "fuel-2",
    category: "fuel",
    text: "I hydrate before performance drops show up.",
  },
  {
    id: "fuel-3",
    category: "fuel",
    text: "I get enough protein and micronutrient-dense food for my goals.",
  },
  {
    id: "fuel-4",
    category: "fuel",
    text: "My caffeine and alcohol patterns do not compromise recovery.",
  },
  {
    id: "focus-1",
    category: "focus",
    text: "I know the highest-value work before the day starts.",
  },
  {
    id: "focus-2",
    category: "focus",
    text: "I can protect at least one deep-work block most days.",
  },
  {
    id: "focus-3",
    category: "focus",
    text: "I manage notifications and context switching intentionally.",
  },
  {
    id: "focus-4",
    category: "focus",
    text: "My attention stays sharp during important execution windows.",
  },
  {
    id: "purpose-1",
    category: "purpose",
    text: "I can clearly state what I am optimizing for this season.",
  },
  {
    id: "purpose-2",
    category: "purpose",
    text: "My calendar reflects my stated priorities.",
  },
  {
    id: "purpose-3",
    category: "purpose",
    text: "I make decisions from principles instead of constant reaction.",
  },
  {
    id: "purpose-4",
    category: "purpose",
    text: "I end most days knowing what moved the mission forward.",
  },
];

const form = document.querySelector("#assessment-form");
const questionList = document.querySelector("#question-list");
const message = document.querySelector(".assessment-message");
const questionProgress = document.querySelector("#question-progress");
const completionPercentage = document.querySelector("#completion-percentage");
const completionMeter = document.querySelector("#completion-meter");
const submitButton = document.querySelector(".assessment-submit");
const results = document.querySelector("#assessment-results");
const score = document.querySelector("#human-score");
const summary = document.querySelector("#score-summary");
const categoryScores = document.querySelector("#category-scores");
const recommendations = document.querySelector("#recommendations");
const retake = document.querySelector("#retake-assessment");
const clearHistory = document.querySelector("#clear-history");
const historyCount = document.querySelector("#history-count");
const scoreTrend = document.querySelector("#score-trend");
const radarChart = document.querySelector("#radar-chart");
const previousScores = document.querySelector("#previous-scores");

renderQuestions();
updateProgress();
loadSavedResult();

form?.addEventListener("change", (event) => {
  if (event.target.matches("input[type='radio']")) {
    updateProgress();
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const answers = Object.fromEntries(questions.map((question) => [question.id, Number(data.get(question.id))]));

  if (Object.values(answers).some((value) => !value)) {
    message.textContent = "Complete every signal to calculate your Human Index.";
    message.classList.add("error");
    updateProgress();
    return;
  }

  const result = calculateResult(answers);
  saveResult(result);
  renderResult(result);
  results.hidden = false;
  message.textContent = "";
  message.classList.remove("error");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

retake?.addEventListener("click", () => {
  localStorage.removeItem(assessmentKey);
  form.reset();
  updateProgress();
  results.hidden = true;
  message.textContent = "";
  document.querySelector(".assessment-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

clearHistory?.addEventListener("click", () => {
  localStorage.removeItem(assessmentKey);
  localStorage.removeItem(historyKey);
  localStorage.removeItem(legacyAssessmentKey);
  form.reset();
  updateProgress();
  results.hidden = true;
  message.textContent = "Assessment history cleared on this device.";
  message.classList.remove("error");
  document.querySelector(".assessment-shell")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

function renderQuestions() {
  if (!questionList) {
    return;
  }

  questionList.innerHTML = questions
    .map((question, index) => {
      const category = categories[question.category];
      const options = [1, 2, 3, 4, 5]
        .map(
          (value) => `
            <label>
              <input type="radio" name="${question.id}" value="${value}" required />
              <span aria-hidden="true"></span>
              <strong>${value}</strong>
            </label>
          `
        )
        .join("");

      return `
        <fieldset class="question-card">
          <legend>
            <span>${String(index + 1).padStart(2, "0")} / ${category.label}</span>
            ${question.text}
          </legend>
          <div class="rating-row" aria-label="${question.text}">
            <div class="rating-numbers" aria-hidden="true">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <div class="rating-options">
              ${options}
            </div>
          </div>
        </fieldset>
      `;
    })
    .join("");
}

function updateProgress() {
  if (!form || !questionProgress || !completionPercentage || !completionMeter || !submitButton) {
    return;
  }

  const answered = new Set(
    [...form.querySelectorAll("input[type='radio']:checked")].map((input) => input.name)
  ).size;
  const percent = Math.round((answered / questions.length) * 100);
  const ready = answered === questions.length;

  questionProgress.textContent = `Question ${Math.min(answered + 1, questions.length)} of ${questions.length}`;
  completionPercentage.textContent = `${percent}% complete`;
  completionMeter.value = percent;
  completionMeter.textContent = `${percent}%`;
  submitButton.disabled = !ready;
  submitButton.closest(".assessment-submit-bar")?.classList.toggle("is-ready", ready);
}

function calculateResult(answers) {
  const categoryResults = Object.keys(categories).map((category) => {
    const categoryQuestions = questions.filter((question) => question.category === category);
    const total = categoryQuestions.reduce((sum, question) => sum + answers[question.id], 0);
    const average = total / categoryQuestions.length;
    return {
      id: category,
      label: categories[category].label,
      score: Math.round(((average - 1) / 4) * 100),
    };
  });

  const humanIndex = Math.round(
    categoryResults.reduce((sum, item) => sum + item.score, 0) / categoryResults.length
  );

  return {
    createdAt: new Date().toISOString(),
    answers,
    humanIndex,
    categories: categoryResults,
    recommendations: categoryResults
      .slice()
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((item) => ({
        label: item.label,
        score: item.score,
        text: categories[item.id].recommendation,
      })),
  };
}

function renderResult(result) {
  score.textContent = result.humanIndex;
  summary.textContent = getSummary(result.humanIndex);
  const history = loadHistory();

  categoryScores.innerHTML = result.categories
    .map(
      (item) => `
        <div class="category-score">
          <div>
            <span>${item.label}</span>
            <strong>${item.score}</strong>
          </div>
          <meter min="0" max="100" value="${item.score}">${item.score}</meter>
        </div>
      `
    )
    .join("");

  recommendations.innerHTML = result.recommendations
    .map(
      (item) => `
        <li>
          <span>${item.label} / ${item.score}</span>
          <p>${item.text}</p>
        </li>
      `
    )
    .join("");

  renderDashboard(result, history);
}

function loadSavedResult() {
  try {
    migrateLegacyResult();
    const saved = JSON.parse(localStorage.getItem(assessmentKey) || "null");
    const history = loadHistory();
    const latest = saved || history[0] || null;

    if (latest?.humanIndex) {
      renderResult(latest);
      results.hidden = false;
    }
  } catch {
    localStorage.removeItem(assessmentKey);
  }
}

function saveResult(result) {
  localStorage.setItem(assessmentKey, JSON.stringify(result));
  const history = loadHistory();
  const next = [result, ...history]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.createdAt === item.createdAt) === index)
    .slice(0, maxHistoryEntries);
  localStorage.setItem(historyKey, JSON.stringify(next));
}

function loadHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    return Array.isArray(history) ? history.filter((item) => item?.humanIndex) : [];
  } catch {
    localStorage.removeItem(historyKey);
    return [];
  }
}

function migrateLegacyResult() {
  const hasHistory = localStorage.getItem(historyKey);
  const legacy = JSON.parse(localStorage.getItem(legacyAssessmentKey) || "null");

  if (!hasHistory && legacy?.humanIndex) {
    const migrated = {
      ...legacy,
      createdAt: legacy.createdAt || new Date().toISOString(),
    };
    localStorage.setItem(assessmentKey, JSON.stringify(migrated));
    localStorage.setItem(historyKey, JSON.stringify([migrated]));
  }
}

function renderDashboard(result, history) {
  const orderedHistory = history.slice().reverse();
  historyCount.textContent = `${history.length} ${history.length === 1 ? "entry" : "entries"}`;
  scoreTrend.innerHTML = renderTrendChart(orderedHistory);
  radarChart.innerHTML = renderRadarChart(result.categories);
  previousScores.innerHTML = renderPreviousScores(history);
}

function renderTrendChart(history) {
  if (!history.length) {
    return `<p class="empty-state">Complete the assessment to start your Human Index trend.</p>`;
  }

  const width = 320;
  const height = 150;
  const padding = 18;
  const points = history.map((item, index) => {
    const x = history.length === 1 ? width / 2 : padding + (index / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - (item.humanIndex / 100) * (height - padding * 2);
    return `${x},${y}`;
  });

  const latest = history[history.length - 1];
  const first = history[0];
  const delta = latest.humanIndex - first.humanIndex;
  const deltaLabel = delta > 0 ? `+${delta}` : String(delta);

  return `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Score trend from ${first.humanIndex} to ${latest.humanIndex}">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" />
      <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" />
      <polyline points="${points.join(" ")}" />
      ${points
        .map((point) => {
          const [x, y] = point.split(",");
          return `<circle cx="${x}" cy="${y}" r="4" />`;
        })
        .join("")}
    </svg>
    <div class="trend-meta">
      <span>Latest ${latest.humanIndex}</span>
      <span>${history.length > 1 ? `Trend ${deltaLabel}` : "Baseline set"}</span>
    </div>
  `;
}

function renderRadarChart(categoryResults) {
  const size = 260;
  const center = size / 2;
  const radius = 94;
  const labels = categoryResults.map((item) => item.label);
  const points = categoryResults.map((item, index) => {
    const angle = (Math.PI * 2 * index) / categoryResults.length - Math.PI / 2;
    const valueRadius = radius * (item.score / 100);
    return [
      center + Math.cos(angle) * valueRadius,
      center + Math.sin(angle) * valueRadius,
    ];
  });
  const axis = categoryResults.map((item, index) => {
    const angle = (Math.PI * 2 * index) / categoryResults.length - Math.PI / 2;
    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (radius + 24),
      labelY: center + Math.sin(angle) * (radius + 24),
      label: labels[index],
      score: item.score,
    };
  });

  return `
    <svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Radar chart of category scores">
      <polygon class="radar-grid" points="${axis.map((item) => `${item.x},${item.y}`).join(" ")}" />
      ${axis.map((item) => `<line x1="${center}" y1="${center}" x2="${item.x}" y2="${item.y}" />`).join("")}
      <polygon class="radar-area" points="${points.map((point) => point.join(",")).join(" ")}" />
      ${points.map((point) => `<circle cx="${point[0]}" cy="${point[1]}" r="4" />`).join("")}
      ${axis
        .map(
          (item) => `
            <text x="${item.labelX}" y="${item.labelY}">
              ${item.label} ${item.score}
            </text>
          `
        )
        .join("")}
    </svg>
  `;
}

function renderPreviousScores(history) {
  if (!history.length) {
    return `<p class="empty-state">No previous scores yet.</p>`;
  }

  return history
    .slice(0, 5)
    .map(
      (item, index) => `
        <article>
          <span>${index === 0 ? "Latest" : formatDate(item.createdAt)}</span>
          <strong>ⓗ ${item.humanIndex}</strong>
        </article>
      `
    )
    .join("");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getSummary(value) {
  if (value >= 85) {
    return "High readiness. Keep the system stable and protect your strongest inputs.";
  }

  if (value >= 70) {
    return "Solid operating state. One or two weak signals are limiting the upside.";
  }

  if (value >= 50) {
    return "Mixed readiness. Choose one recovery or focus constraint and fix it first.";
  }

  return "System under load. Reduce friction, stabilize recovery, and rebuild consistency.";
}
