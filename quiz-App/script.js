let isLogin = false;
let currentDomain = "";
let currentQuiz = [];
let currentIndex = 0;
let score = 0;

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("auth-title").textContent = isLogin ? "Login" : "Register";
  document.querySelector("#auth-container button").textContent = isLogin ? "Login" : "Register";
  document.getElementById("switch-auth").innerHTML = isLogin
    ? `Don't have an account? <a onclick="toggleAuth()">Register here</a>`
    : `Already have an account? <a onclick="toggleAuth()">Login here</a>`;
  document.getElementById("auth-msg").textContent = '';
}

function handleAuth() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!user || !pass) {
    msg.textContent = "Please fill all fields.";
    msg.style.color = "red";
    return;
  }

  if (isLogin) {
    const stored = localStorage.getItem(user);
    if (stored === pass) {
      msg.textContent = "Login successful!";
      msg.style.color = "green";
      setTimeout(() => {
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("domain-container").classList.remove("hidden");
      }, 500);
    } else {
      msg.textContent = "Invalid credentials.";
      msg.style.color = "red";
    }
  } else {
    localStorage.setItem(user, pass);
    msg.textContent = "Registered successfully! Please login.";
    msg.style.color = "green";
    toggleAuth();
  }
}

// Quiz Data by Domain & Quiz
const quizzes = {
  HTML: {
    "Quiz 1": [
      { question: "What does HTML stand for?", options: ["Hyper Text Makeup Language", "High Text Markup Language", "Hyper Text Markup Language", "Hyperlink Text Mark Language"], answer: "Hyper Text Markup Language" },
      { question: "Which tag is used to insert an image?", options: ["<img>", "<image>", "<src>", "<picture>"], answer: "<img>" },
      { question: "Which tag creates a hyperlink?", options: ["<a>", "<link>", "<href>", "<url>"], answer: "<a>" },
    ],
    "Quiz 2": [
      { question: "Which tag is used for a line break?", options: ["<br>", "<lb>", "<break>", "<hr>"], answer: "<br>" },
      { question: "What does <ul> define?", options: ["Ordered List", "Unordered List", "Underline", "Utility List"], answer: "Unordered List" },
    ]
  },
  CSS: {
    "Quiz 1": [
      { question: "What does CSS stand for?", options: ["Color Style Sheet", "Cascading Style Sheet", "Computer Style Sheet", "Creative Style System"], answer: "Cascading Style Sheet" },
      { question: "How do you center text in CSS?", options: ["text-align: center;", "align: center;", "center-text: yes;", "text-center: true;"], answer: "text-align: center;" },
    ]
  },
  JavaScript: {
    "Quiz 1": [
      { question: "What is DOM?", options: ["Data Object Mode", "Document Object Model", "Dynamic Object Map", "Digital Output Module"], answer: "Document Object Model" },
      { question: "Which keyword declares a variable?", options: ["let", "define", "create", "val"], answer: "let" },
    ]
  },
  AI: {
    "Quiz 1": [
      { question: "What is AI?", options: ["Automated Interface", "Artificial Intelligence", "Auto Inference", "Artificial Integration"], answer: "Artificial Intelligence" },
      { question: "Which is a field of AI?", options: ["Vision", "Speech", "Planning", "All of the above"], answer: "All of the above" }
    ]
  },
  ML: {
    "Quiz 1": [
      { question: "ML stands for?", options: ["Machine Learning", "Media Learning", "Micro Language", "None"], answer: "Machine Learning" },
      { question: "What is required to train ML models?", options: ["Music", "Data", "Code", "Books"], answer: "Data" }
    ]
  },
  General: {
    "Quiz 1": [
      { question: "Capital of India?", options: ["New Delhi", "Mumbai", "Chennai", "Kolkata"], answer: "New Delhi" },
      { question: "Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Mars" }
    ]
  }
};

function selectDomain(domain) {
  currentDomain = domain;
  const topics = quizzes[domain];
  const topicContainer = document.getElementById("topic-buttons");
  topicContainer.innerHTML = '';
  document.getElementById("domain-container").classList.add("hidden");
  document.getElementById("topic-container").classList.remove("hidden");
  document.getElementById("topic-title").textContent = `Select Quiz in ${domain}`;

  Object.keys(topics).forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic;
    btn.onclick = () => startQuizTopic(domain, topic);
    topicContainer.appendChild(btn);
  });
}

function startQuizTopic(domain, topic) {
  currentQuiz = quizzes[domain][topic];
  currentIndex = 0;
  score = 0;
  document.getElementById("topic-container").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  loadQuestion();
  document.getElementById("next-btn").style.display = "none";
}

function loadQuestion() {
  const q = currentQuiz[currentIndex];
  document.getElementById("question").textContent = q.question;
  const optionsEl = document.getElementById("options");
  const feedbackEl = document.getElementById("feedback");
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.onclick = () => checkAnswer(opt);
    optionsEl.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const correct = currentQuiz[currentIndex].answer;
  const feedbackEl = document.getElementById("feedback");

  if (selected === correct) {
    score++;
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = `❌ Wrong! Correct: ${correct}`;
    feedbackEl.style.color = "red";
  }

  Array.from(document.getElementById("options").children).forEach(btn => btn.disabled = true);
  document.getElementById("next-btn").style.display = "inline-block";
}

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < currentQuiz.length) {
    loadQuestion();
    document.getElementById("next-btn").style.display = "none";
  } else {
    document.getElementById("quiz-box").classList.add("hidden");
    document.getElementById("result-box").classList.remove("hidden");
    document.getElementById("score").textContent = `Your Score: ${score} / ${currentQuiz.length}`;
  }
});

function restartQuiz() {
  document.getElementById("result-box").classList.add("hidden");
  document.getElementById("quiz-box").classList.remove("hidden");
  currentIndex = 0;
  score = 0;
  loadQuestion();
  document.getElementById("next-btn").style.display = "none";
}
