// frontend/src/ws.js
const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
  console.log('🟢 WebSocket соединение установлено');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('📨 Получено сообщение по WebSocket:', data);
};

export default socket;
