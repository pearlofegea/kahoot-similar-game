const rooms = {};  // { roomCode: { admin: socketId, players: [nickname, ...] } }

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function createRoom(adminSocketId) {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
        admin: adminSocketId,
        players: []
    };
    return roomCode;
}

function joinRoom(roomCode, socketId, nickname) {
    if (rooms[roomCode]) {
        rooms[roomCode].players.push({ socketId, nickname });
        return true;
    }
    return false;
}

module.exports = { createRoom, joinRoom };