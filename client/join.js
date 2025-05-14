const socket = io();

// Form ve inputları seç
const joinForm = document.getElementById('joinForm');
const roomCodeInput = document.getElementById('roomCode');
const nicknameInput = document.getElementById('nickname');
const statusMessage = document.getElementById('statusMessage');

joinForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    const roomCode = roomCodeInput.value.trim();
    const nickname = nicknameInput.value.trim();

    if (roomCode && nickname) {
        socket.emit('joinRoom', { roomCode, nickname });
    }
});

socket.on('joinSuccess', () => {
    localStorage.setItem('nickname', nicknameInput.value.trim());
    window.location.href = 'player.html';
});

socket.on('joinFailed', () => {
    statusMessage.textContent = 'Katılım başarısız! Lütfen doğru bir oda kodu girin.';
    statusMessage.style.color = 'red';
});