const socket = io();

const nicknameDisplay = document.getElementById('nicknameDisplay');

// Katılım sırasında nickname’i localStorage’a kaydetmiştik, şimdi okuyalım
const nickname = localStorage.getItem('nickname');
if (nickname) {
    nicknameDisplay.textContent = `Katılımcı: ${nickname}`;
}

// Sunucudan soru gelince ekrana göster
socket.on('newQuestion', (questionData) => {
    showQuestion(questionData);
});

// Soru gösterme fonksiyonu
function showQuestion(data) {
    const container = document.querySelector('.container');
    container.innerHTML += `
        <div class="question-box">
            <h2>${data.question}</h2>
            <div class="options">
                ${data.options.map((opt, i) => `
                    <button class="answer-btn" data-index="${i}">${opt}</button>
                `).join('')}
            </div>
        </div>
    `;

    // Cevap butonlarına tıklama
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const answerIndex = btn.dataset.index;
            socket.emit('submitAnswer', {
                nickname,
                answerIndex
            });
        });
    });
}