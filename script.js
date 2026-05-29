const forms = document.querySelectorAll(".waitlist-form");
const storageKey = "human-exe-waitlist";
const endpoint = window.HUMAN_EXE_WAITLIST_ENDPOINT || "";
const revealTargets = document.querySelectorAll(
  ".section, .logo-cloud, .ecosystem-grid article, .feature-grid article, .privacy-grid article, .timeline li, .waitlist"
);

revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();

    if (!message) {
      return;
    }

    message.classList.remove("error");

    if (!isValidEmail(email)) {
      message.classList.add("error");
      message.textContent = "Enter an email to join the waitlist.";
      return;
    }

    saveSignup(email);

    if (endpoint) {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "humanexe.ai" }),
      }).catch(() => {});
    }

    if (typeof window.plausible === "function") {
      window.plausible("Waitlist Signup", { props: { source: "landing_page" } });
    }

    syncMessages("System online. You’re on the list.");
    forms.forEach((item) => item.reset());
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveSignup(email) {
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const next = [email, ...existing.filter((item) => item !== email)].slice(0, 20);
    localStorage.setItem(storageKey, JSON.stringify(next));
  } catch {
    return;
  }
}

function syncMessages(text) {
  document.querySelectorAll(".form-message").forEach((message) => {
    message.classList.remove("error");
    message.classList.add("success");
    message.textContent = text;
  });
}
