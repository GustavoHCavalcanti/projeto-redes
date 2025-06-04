const socket = io('http://' + window.location.hostname + ':3000', {
  reconnectionAttempts: 5,
  timeout: 10000
});


// Elementos da interface
const chatBox = document.getElementById("chat-box");
const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

// Adiciona uma nova mensagem no chat
function appendMessage(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Enviar mensagem ao clicar no botão
sendButton.onclick = () => {
  const user = usernameInput.value.trim() || "Anonimo";
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit("chat_message", { user, msg, timestamp: new Date().toLocaleTimeString() });
    messageInput.value = "";
  }
};

// Receber mensagem do servidor
socket.on("chat_message", (data) => {
  appendMessage(`[${data.timestamp}] ${data.user}: ${data.msg}`);
});

// Tratamento de erros
ssocket.on('connect', () => {
  console.log('✅ Conectado ao servidor! ID:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('Erro de conexão:', err.message);
});
