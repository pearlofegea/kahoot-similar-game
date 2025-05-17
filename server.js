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

const roomQuestions = {};
const roomCurrentQuestion = {};
const socketRoomMap = {};
const roomScores = {};

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
            socketRoomMap[socket.id] = roomCode;
            if (!roomScores[roomCode]) roomScores[roomCode] = {};
            roomScores[roomCode][nickname] = 0;
            io.to(roomCode).emit('playerJoined', nickname);
            socket.emit('joinSuccess');
    
            // Yönlendirme olduktan sonra 1 saniye gecikmeli soru gönder
            setTimeout(() => {
                const questions = roomQuestions[roomCode];
                if (questions && questions.length > 0) {
                    const firstQuestion = questions[0]; // veya Math.floor(Math.random() * questions.length)
                    io.to(roomCode).emit('newQuestion', firstQuestion);
                } else {
                    console.log(`Oda ${roomCode} için henüz soru yok.`);
                }
            }, 1000);
        } else {
            socket.emit('joinFailed');
        }
    });

    socket.on('disconnect', () => {
        console.log('Kullanıcı ayrıldı:', socket.id);
    });

    socket.on('addQuestion', (questionData) => {
        const { roomCode, question, options, correct } = questionData;

        if (!roomQuestions[roomCode]) {
            roomQuestions[roomCode] = [];
        }

        roomQuestions[roomCode].push({
            question,
            options,
            correct
        });

        console.log(`Odaya soru eklendi (${roomCode}):`, questionData);
    });

    socket.on('submitAnswer', ({ nickname, selectedOption }) => {
        const roomCode = socketRoomMap[socket.id];
        if (!roomCode) return;

        const questions = roomQuestions[roomCode];
        if (!questions || questions.length === 0) return;

        const currentIndex = roomCurrentQuestion[roomCode] ?? 0;
        const currentQuestion = questions[currentIndex];

        if (!currentQuestion) return;

        const isCorrect = selectedOption === currentQuestion.correct;
        console.log(`${nickname} cevabı: ${selectedOption} → ${isCorrect ? 'DOĞRU' : 'YANLIŞ'}`);
        if (!roomScores[roomCode]) roomScores[roomCode] = {};
        if (!roomScores[roomCode][nickname]) roomScores[roomCode][nickname] = 0;
        if (isCorrect) roomScores[roomCode][nickname] += 1;
        socket.emit('answerResult', { isCorrect, score: roomScores[roomCode][nickname] });

        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            roomCurrentQuestion[roomCode] = nextIndex;
            io.to(roomCode).emit('newQuestion', questions[nextIndex]);
        } else {
            io.to(roomCode).emit('gameOver', {
                message: "Oyun bitti. Tüm sorular gösterildi.",
                scores: roomScores[roomCode]
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});