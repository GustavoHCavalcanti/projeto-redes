const socket = io();

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
  const user = usernameInput.value.trim();
  const msg = messageInput.value.trim();
  if (user && msg) {
    socket.emit("chat_message", { user, msg });
    messageInput.value = "";
  }
};

// Receber mensagem do servidor
socket.on("chat_message", (data) => {
  appendMessage(`${data.user}: ${data.msg}`);
});
