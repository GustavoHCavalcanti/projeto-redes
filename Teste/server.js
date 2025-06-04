const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir arquivos estáticos
app.use(express.static(__dirname));

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'), {
    headers: {
      'Content-Type': 'application/javascript'
    }
  });
});

// Lógica do chat
io.on('connection', (socket) => {
  console.log('✅ Novo usuário conectado:', {
    id: socket.id,
    handshake: socket.handshake,
    time: new Date().toISOString()
  });

  // Recebe mensagens do usuario
  socket.on('chat_message', (data) => {
    console.log('Mensagem recebida:', data);

    // Adiciona timestamp se não existir
    if (!data.timestamp) {
      data.timestamp = new Date().toLocaleTimeString();
    }

    // Envia a mensagem para todos os usuarios conectados
    io.emit('chat_message', data);
  });

  // Quando um usuário desconectar
  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
  console.log(`Acessível na rede local via: http://${localIP}:${PORT}`);
});