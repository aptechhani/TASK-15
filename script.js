const questions = [
    { 
        question: "What does HTML stand for?", 
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Management Language"], 
        answer: "Hyper Text Markup Language" 
    },
    { 
        question: "Which of the following is a CSS framework?", 
        options: ["React", "Bootstrap", "JavaScript", "PHP"], 
        answer: "Bootstrap" 
    },
    { 
        question: "What is the correct syntax of external jsfile?", 
        options: ["<script href='script.js'>", "<script src='script.js'>", "<js link='script.js'>", "<javascript>script.js</javascript>"], 
        answer: "<script src='script.js'>" 
    },
    { 
        question: "Which of these is NOT a JavaScript data type?", 
        options: ["String", "Boolean", "Integer", "Object"], 
        answer: "Integer" 
    },
    { 
        question: "What does Tailwind CSS primarily use?", 
        options: ["Component-based styling", "Inline styles", "Utility classes", "CSS-in-JS"], 
        answer: "Utility classes" 
    }
];


let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;
let used5050 = false;
let usedSkip = false;
let usedExtraTime = false;

const welcomeScreen = document.getElementById("welcome-screen");
const quizContainer = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const submitBtn = document.getElementById("submit-btn");
const resultContainer = document.getElementById("result-container");
const progressText = document.getElementById("progress");

// Lifeline Buttons
const lifeline5050 = document.getElementById("lifeline-5050");
const lifelineSkip = document.getElementById("lifeline-skip");
const lifelineExtraTime = document.getElementById("lifeline-extra-time");

startBtn.addEventListener("click", function () {
    welcomeScreen.style.display = "none";
    quizContainer.style.display = "block";
    loadQuestion();
});

function loadQuestion() {
    clearInterval(timer);
    timeLeft = 60;
    timerEl.textContent = `Time Left: ${timeLeft}s`;

    const currentQuestion = questions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
    optionsEl.innerHTML = "";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option, button);
        optionsEl.appendChild(button);
    });

    progressText.textContent = `Question ${currentQuestionIndex + 1} out of ${questions.length}`;

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
    }

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);

    prevBtn.disabled = currentQuestionIndex === 0;
}
function checkAnswer(selected, selectedButton) {
    clearInterval(timer);
    const correctAnswer = questions[currentQuestionIndex].answer;

    Array.from(optionsEl.children).forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.style.backgroundColor = "green";
            button.style.color = "white"; // ✅ White text for correct answer
            button.textContent += " ✔ Correct";
        } else if (button === selectedButton) {
            button.style.backgroundColor = "#800000";
            
            button.style.color = "white"; // ✅ White text for correct answer
            button.textContent += " ✘ Wrong";
        }
    });

    if (selected === correctAnswer) {
        score++;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
}

function showResult() {
    questionEl.textContent = "Quiz Completed!";
    optionsEl.innerHTML = "";
    timerEl.style.display = "none";
    prevBtn.style.display = "none";
    submitBtn.style.display = "none";

    const totalQuestions = questions.length;
    const correctAnswers = score;
    const wrongAnswers = totalQuestions - correctAnswers;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    let grade = "";

    if (percentage >= 90) {
        grade = "A+ (Excellent)";
    } else if (percentage >= 80) {
        grade = "A (Very Good)";
    } else if (percentage >= 70) {
        grade = "B (Good)";
    } else if (percentage >= 60) {
        grade = "C (Average)";
    } else if (percentage >= 50) {
        grade = "D (Below Average)";
    } else {
        grade = "F (Fail)";
    }

    resultContainer.innerHTML = `
        <h2>Quiz Summary</h2>
        <p>Total Questions: ${totalQuestions}</p>
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Wrong Answers: ${wrongAnswers}</p>
        <p>Percentage: ${percentage}%</p>
        <p>Grade: <strong>${grade}</strong></p>
        <button id="restart-btn">Restart Quiz</button>
    `;

    document.getElementById("restart-btn").addEventListener("click", function () {
        currentQuestionIndex = 0;
        score = 0;
        timerEl.style.display = "block";
        nextBtn.style.display = "inline-block";
        prevBtn.style.display = "inline-block";
        resultContainer.innerHTML = "";
        loadQuestion();
    });
}

// **Updated Lifeline Functions**
lifeline5050.addEventListener("click", function () {
    if (used5050) return;
    used5050 = true;

    const currentQuestion = questions[currentQuestionIndex];
    let incorrectOptions = currentQuestion.options.filter(opt => opt !== currentQuestion.answer);
    incorrectOptions = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);

    Array.from(optionsEl.children).forEach(button => {
        if (incorrectOptions.includes(button.textContent)) {
            button.style.display = "none";
        }
    });

    disableLifeline(lifeline5050);
});

lifelineSkip.addEventListener("click", function () {
    if (usedSkip) return;
    usedSkip = true;
    nextQuestion();
    disableLifeline(lifelineSkip);
});

lifelineExtraTime.addEventListener("click", function () {
    if (usedExtraTime) return;
    usedExtraTime = true;
    timeLeft += 10;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    disableLifeline(lifelineExtraTime);
});

nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
submitBtn.addEventListener("click", showResult);

// **Disable Lifeline Function**
function disableLifeline(button) {
    button.style.backgroundColor = "gray";
    button.style.color = "#fff";
    button.style.cursor = "not-allowed";
    button.style.opacity = "0.5";
    button.disabled = true;
}

// **Dark Mode**
const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
}

darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.removeItem("darkMode");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const restartBtn = document.getElementById("restart-btn");

    if (restartBtn) {
        let newButton = document.createElement("button");
        newButton.id = "new-btn";
        newButton.textContent = "New Button";
        newButton.style.marginLeft = "10px";

        restartBtn.after(newButton);

        newButton.addEventListener("click", function () {
            alert("New Button Clicked!");
        });
    }
});
















function updateProgressBar() {
    let progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
}

// Jab bhi next question load ho, progress bar update ho
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        updateProgressBar();
    }
}

// Jab bhi previous question load ho, progress bar update ho
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
        updateProgressBar();
    }
}

// Ensure progress bar updates when question loads
updateProgressBar();
