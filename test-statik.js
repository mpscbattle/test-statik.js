let questions = [];
let currentIdx = 0;
let selectedAnswers = [];
let timer = 1500; // 25 minutes
let timerInterval;

function loadQuestions() {
    questions = [];
    document.querySelectorAll(".question-data").forEach(qEl => {
        questions.push({
            question: qEl.querySelector(".q").innerText,
            options: Array.from(qEl.querySelectorAll(".opt")).map(el => el.innerText),
            answer: parseInt(qEl.getAttribute("data-answer")),
            explanation: qEl.getAttribute("data-explanation") || ""
        });
    });
}

function renderQuestion() {
    const q = questions[currentIdx];
    const container = document.getElementById("quiz-container");
    
    // मुख्य प्रश्नासाठी Circle लुक कायम ठेवला आहे
    container.innerHTML = `
        <div class="question-number-circle">${currentIdx + 1}</div>
        <div class="question">${q.question}</div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <div class="option ${selectedAnswers[currentIdx] === i ? 'selected' : ''}" onclick="selectOpt(${i})">${opt}</div>
            `).join('')}
        </div>`;
        
    document.getElementById("questionCountDisplay").innerText = `Question : ${currentIdx + 1}/${questions.length}`;
    
    let attempted = selectedAnswers.filter(v => v !== undefined).length;
    document.getElementById("progressBar").style.width = (attempted / questions.length) * 100 + "%";
    
    document.getElementById("prevBtn").disabled = currentIdx === 0;
    
    if (currentIdx === questions.length - 1) {
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("submitBtn").style.display = "block";
    } else {
        document.getElementById("nextBtn").style.display = "block";
        document.getElementById("submitBtn").style.display = "none";
    }
}

function selectOpt(idx) {
    selectedAnswers[currentIdx] = idx;
    renderQuestion();
}

function changeQuestion(step) {
    currentIdx += step;
    renderQuestion();
}

function startTimer() {
    timerInterval = setInterval(() => {
        let h = Math.floor(timer / 3600);
        let m = Math.floor((timer % 3600) / 60);
        let s = timer % 60;
        document.getElementById("timer").innerText = `🕛 ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        if (timer <= 0) {
            clearInterval(timerInterval);
            submitResults();
        }
        timer--;
    }, 1000);
}

function submitResults() {
    clearInterval(timerInterval);
    document.getElementById("quizBox").style.display = "none";
    document.getElementById("reportCard").style.display = "block";
    
    let correct = 0;
    questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.answer) correct++;
    });
    
    document.getElementById("total").innerText = questions.length;
    document.getElementById("attempted").innerText = selectedAnswers.filter(v => v !== undefined).length;
    document.getElementById("correct").innerText = correct;
    document.getElementById("wrong").innerText = selectedAnswers.filter(v => v !== undefined).length - correct;
    document.getElementById("score").innerText = correct;
    document.getElementById("totalScore").innerText = questions.length;
}

function showAnalysis() {
    // १. रिपोर्ट कार्ड लपवू नका, ते 'block' ठेवा जेणेकरून ते वर दिसेल
    document.getElementById("reportCard").style.display = "block";
    
    // २. ॲनालिसिस कार्ड खाली दाखवा
    document.getElementById("analysisCard").style.display = "block";
    
    // ३. थेट ॲनालिसिस सेक्शनवर जाण्यासाठी स्क्रोल करा (पर्यायी)
    document.getElementById("analysisCard").scrollIntoView({ behavior: 'smooth' });

    const container = document.getElementById("analysisContent");
    container.innerHTML = questions.map((q, i) => {
        const userAns = selectedAnswers[i];
        let status = userAns === undefined ? "Not Attempted" : (userAns === q.answer ? "Correct" : "Wrong");
        let fClass = userAns === undefined ? "not-attempted-feedback" : (userAns === q.answer ? "correct-feedback" : "wrong-feedback");
        
        return `
            <div class="analysis-box">
                <span class="q-label-analysis">Question : ${i + 1}</span>
                <div class="question">${q.question}</div>
                <div class="options">
                    ${q.options.map((j_opt, j) => {
                        let optClass = (j === q.answer) ? "correct" : (j === userAns ? "wrong" : "");
                        return `<div class="option ${optClass}">${j_opt}</div>`;
                    }).join('')}
                </div>
                <div class="feedback ${fClass}">${status}</div>
                ${q.explanation ? `<div class="explanation-box"><b>📝 स्पष्टीकरण :</b> ${q.explanation}</div>` : ''}
            </div>`;
    }).join('');
}


document.getElementById("centerStartBtn").onclick = () => {
    loadQuestions();
    document.getElementById("initialStartScreen").style.display = "none";
    document.getElementById("quizBox").style.display = "block";
    startTimer();
    renderQuestion();
};
