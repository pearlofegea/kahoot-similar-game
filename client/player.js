console.log("player.js yüklendi");
const socket = io();

const nicknameDisplay = document.getElementById('nicknameDisplay');

// Katılım sırasında nickname’i localStorage’a kaydetmiştik, şimdi okuyalım
const nickname = localStorage.getItem('nickname');
if (nickname) {
    nicknameDisplay.textContent = `Katılımcı: ${nickname}`;
}

// Sunucudan soru gelince ekrana göster
socket.on('newQuestion', (questionData) => {
    console.log("SORU GELDİ:", questionData);
    alert("Soru geldi!");
    showQuestion(questionData);
});

// Soru gösterme fonksiyonu
function showQuestion(data) {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="question-box">
            <h2>${data.question}</h2>
            <div class="options">
                ${Object.entries(data.options).map(([key, value]) => `
                    <button class="answer-btn" data-option="${key}">${key}: ${value}</button>
                `).join('')}
            </div>
        </div>
    `;

    // Cevap butonlarına tıklama
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedOption = btn.dataset.option;
            socket.emit('submitAnswer', {
                nickname,
                selectedOption
            });
        });
    });
}

socket.on('answerResult', ({ isCorrect }) => {
    const resultBox = document.createElement('div');
    resultBox.className = 'result-box';
    resultBox.textContent = isCorrect ? '✅ Doğru cevap!' : '❌ Yanlış cevap!';
    document.querySelector('.container').appendChild(resultBox);
});

socket.on('gameOver', ({ message, scores }) => {
    const container = document.querySelector('.container');
    const gameOverBox = document.createElement('div');
    gameOverBox.className = 'game-over-box';
    gameOverBox.textContent = message;
    container.appendChild(gameOverBox);

    if (scores) {
        const scoreBoard = document.createElement('div');
        scoreBoard.className = 'score-board';
        scoreBoard.innerHTML = '<h3>Skor Tablosu</h3><ul>' +
            Object.entries(scores).map(([name, score]) =>
                `<li>${name}: ${score}</li>`
            ).join('') + '</ul>';
        container.appendChild(scoreBoard);
    }
});