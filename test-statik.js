let current = 0,
  selectedAnswers = [],
  quizLocked = [],
  correctCount = 0;
let timer = 1500; // Increased timer to 25 minutes (25 * 60 seconds)
let timerStarted = false;
let timerInterval;
const quizDiv = document.getElementById('quiz');
const timerDiv = document.getElementById('timer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
// const resetBtn = document.getElementById('resetBtn'); // Removed this line
const reportCard = document.getElementById('reportCard');
const analysisCard = document.getElementById('analysisCard');
const viewAnalysisBtn = document.getElementById('viewAnalysisBtn');
const startBtn = document.getElementById('startBtn');
const onlineTestBtn = document.getElementById('onlineTestBtn');

const questionElements = document.querySelectorAll('.question-data');
const questions = [];
questionElements.forEach(qEl => {
  const q = qEl.querySelector('.q').innerText;
  const opts = Array.from(qEl.querySelectorAll('.opt')).map(el => el.innerText);
  const correctIndex = parseInt(qEl.getAttribute('data-answer'));
  const explanation = qEl.getAttribute('data-explanation') || ''; // Get the explanation, default to empty string
  questions.push({
    question: q,
    options: opts,
    answer: correctIndex,
    explanation: explanation,
  });
});

document.getElementById('questionBank').style.display = 'none';

function showQuestion(index) {
  const q = questions[index];
  let html = `
    <div class="question">${q.question}</div>
    <div class="options">`;
  q.options.forEach((opt, i) => {
    let cls = 'option';
    // Check if the answer is selected for this question
    if (selectedAnswers[index] === i && !quizLocked[index]) {
      cls += ' selected';
    }
    html += `<div class='${cls}' onclick='selectAnswer(${index}, ${i})'>${opt}</div>`;
  });
  html += `</div>`;
  quizDiv.innerHTML = html;
  // Update question number in the dedicated span element
  document.getElementById('questionNumber').textContent = `${
    index + 1
  }/${questions.length}`;
}

function selectAnswer(qIndex, aIndex) {
  if (quizLocked[qIndex]) return;
  selectedAnswers[qIndex] = aIndex;
  showQuestion(current);
}

function updateTimer() {
  let min = Math.floor(timer / 60);
  let sec = timer % 60;
  timerDiv.textContent = `🕛 ${min}:${sec < 10 ? '0' + sec : sec}`;
  timer--;
  if (timer < 0) {
    clearInterval(timerInterval);
    submitResults();
  }
}

function submitResults() {
  clearInterval(timerInterval);
  document.getElementById('quizBox').style.display = 'none'; // Hide quiz box
  reportCard.style.display = 'block';
  let attempted = selectedAnswers.filter(v => v !== undefined).length;
  correctCount = selectedAnswers.filter(
    (v, i) => v === questions[i].answer
  ).length;
  document.getElementById('total').textContent = questions.length;
  document.getElementById('attempted').textContent = attempted;
  document.getElementById('correct').textContent = correctCount;
  document.getElementById('wrong').textContent = attempted - correctCount;
  document.getElementById('score').textContent = correctCount;
  document.getElementById('totalScore').textContent = questions.length;
  const percent = ((correctCount / questions.length) * 100).toFixed(2);
  document.getElementById('percentage').textContent = percent;
  const msg =
    percent >= 80 ? '' : percent >= 50 ? '' : '';
  document.getElementById('resultMessage').textContent = msg;
  quizLocked = questions.map(() => true);
}

function showAnalysis() {
  analysisCard.style.display = 'block';
  // reportCard.style.display = 'none'; // THIS LINE IS REMOVED
  const container = document.getElementById('analysisContent');
  container.innerHTML = '';
  questions.forEach((q, i) => {
    const userAnswer = selectedAnswers[i];
    let feedback = 'Skipped Question';
    let feedbackClass = 'not-attempted-feedback';
    if (userAnswer !== undefined) {
      const isCorrect = userAnswer === q.answer;
      feedback = isCorrect ? 'Correct Answer' : 'Wrong Answer';
      feedbackClass = isCorrect ? 'correct-feedback' : 'wrong-feedback';
    }
    let html = `<div class='analysis-box'>
    <div class="question-number">${i + 1}/${questions.length}</div>
    <div><b>${q.question}</b></div>`;

    q.options.forEach((opt, j) => {
      let cls = 'option';
      if (j === q.answer) cls += ' correct';
      else if (j === userAnswer) cls += ' wrong';
      html += `<div class='${cls}' style='margin: 5px 0;'>${opt}</div>`;
    });
    html += `<div class='feedback ${feedbackClass}'>${feedback}</div>`;

    // Add explanation box if explanation exists
    if (q.explanation) {
      html += `<div class='explanation-box'><b>स्पष्टीकरण :</b> ${q.explanation}</div>`;
    }
    container.innerHTML += html;
  });
}

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    showQuestion(current);
  }
};

nextBtn.onclick = () => {
  if (current < questions.length - 1) {
    current++;
    showQuestion(current);
  }
};

submitBtn.onclick = submitResults;
viewAnalysisBtn.onclick = showAnalysis;
// resetBtn.onclick = () => location.reload(); // Removed this line

startBtn.onclick = () => {
  if (!timerStarted) {
    timerInterval = setInterval(updateTimer, 1000);
    timerStarted = true;
    startBtn.style.display = 'none'; // Hide Start Test button
    onlineTestBtn.style.display = 'inline-block'; // Show Online Test button
  }
};

// Initial display
showQuestion(current);

