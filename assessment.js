const assessmentKey = "human-exe-assessment-v01";

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
const results = document.querySelector("#assessment-results");
const score = document.querySelector("#human-score");
const summary = document.querySelector("#score-summary");
const categoryScores = document.querySelector("#category-scores");
const recommendations = document.querySelector("#recommendations");
const retake = document.querySelector("#retake-assessment");

renderQuestions();
loadSavedResult();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const answers = Object.fromEntries(questions.map((question) => [question.id, Number(data.get(question.id))]));

  if (Object.values(answers).some((value) => !value)) {
    message.textContent = "Complete every signal to calculate your Human Index.";
    message.classList.add("error");
    return;
  }

  const result = calculateResult(answers);
  localStorage.setItem(assessmentKey, JSON.stringify(result));
  renderResult(result);
  results.hidden = false;
  message.textContent = "";
  message.classList.remove("error");
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

retake?.addEventListener("click", () => {
  localStorage.removeItem(assessmentKey);
  form.reset();
  results.hidden = true;
  message.textContent = "";
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
              <span>${value}</span>
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
            ${options}
          </div>
        </fieldset>
      `;
    })
    .join("");
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
}

function loadSavedResult() {
  try {
    const saved = JSON.parse(localStorage.getItem(assessmentKey) || "null");

    if (saved?.humanIndex) {
      renderResult(saved);
      results.hidden = false;
    }
  } catch {
    localStorage.removeItem(assessmentKey);
  }
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
