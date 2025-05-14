
// kütüphaneler import ediliyor sınıflar çağrılıyor
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createRoom, joinRoom } = require('./rooms');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Statik dosyaları 'client' klasöründen verelim
app.use(express.static(path.join(__dirname, 'client')));
console.log(path.join(__dirname, 'client'));
// WebSocket olayları
io.on('connection', (socket) => {
    console.log('Bir kullanıcı bağlandı:', socket.id);

    socket.on('createRoom', () => {
        const roomCode = createRoom(socket.id);
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
    });

    socket.on('joinRoom', ({ roomCode, nickname }) => {
        const success = joinRoom(roomCode, socket.id, nickname);
        if (success) {
            socket.join(roomCode);
            io.to(roomCode).emit('playerJoined', nickname);
            socket.emit('joinSuccess');
    
            // Yönlendirme olduktan sonra 1 saniye gecikmeli soru gönder
            setTimeout(() => {
                io.to(roomCode).emit('newQuestion', {
                    question: "HTML'nin açılımı nedir?",
                    options: [
                        "HyperText Markup Language",
                        "HighText Machine Language",
                        "Home Tool Markup Language",
                        "Hyperlinks Text Module"
                    ]
                });
            }, 1000);
        } else {
            socket.emit('joinFailed');
        }
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});