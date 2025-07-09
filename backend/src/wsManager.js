let sockets = [];

function register(ws) {
  sockets.push(ws);
  ws.on('close', () => {
    sockets = sockets.filter((client) => client !== ws);
  });
}

function broadcast(data) {
  const payload = JSON.stringify(data);
  sockets.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

module.exports = {
  register,
  broadcast
};