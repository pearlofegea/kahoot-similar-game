// Socket.io bağlantısını başlat
const socket = io();

// DOM elemanlarını seç
const createRoomBtn = document.getElementById('createRoomBtn');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');

// Oda oluştur butonuna tıklandığında sunucuya 'createRoom' olayı gönder
createRoomBtn.addEventListener('click', () => {
    socket.emit('createRoom');
});

// Sunucudan 'roomCreated' olayı geldiğinde, oda kodunu göster
socket.on('roomCreated', (roomCode) => {
    roomCodeDisplay.textContent = roomCode;
});

// Soru formunu ve inputları seç
const questionForm = document.getElementById('questionForm');
const questionText = document.getElementById('questionText');
const optionA = document.getElementById('optionA');
const optionB = document.getElementById('optionB');
const optionC = document.getElementById('optionC');
const optionD = document.getElementById('optionD');
const correctAnswer = document.getElementById('correctAnswer');

// Form gönderildiğinde çalışacak olay
questionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const questionData = {
        question: questionText.value.trim(),
        options: {
            A: optionA.value.trim(),
            B: optionB.value.trim(),
            C: optionC.value.trim(),
            D: optionD.value.trim(),
        },
        correct: correctAnswer.value.trim().toUpperCase(),
        roomCode: roomCodeDisplay.textContent
    };

    // Sunucuya 'addQuestion' olayı gönder
    socket.emit('addQuestion', questionData);

    // Formu temizle
    questionForm.reset();
});