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