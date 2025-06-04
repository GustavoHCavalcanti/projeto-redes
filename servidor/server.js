const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Rota para servir o frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Lógica do chat
io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  // Quando receber uma nova mensagem (usando o evento do seu frontend)
  socket.on('chat_message', (data) => {
    console.log('Mensagem recebida:', data);
    
    // Envia a mensagem para todos os usuarios conectados
    io.emit('chat_message', {
      user: data.user,
      msg: data.msg
    });
  });

  // Quando um usuário desconectar
  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});