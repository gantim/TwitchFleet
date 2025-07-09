const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const { register } = require('./wsManager');

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🟢 WebSocket клиент подключён');
  register(ws);
});

const messageRoutes = require('./controllers/messageController');
const accountRoutes = require('./controllers/accountController');
const joinChannelRoutes = require('./controllers/joinChannelController');
const simulateRoutes = require('./controllers/simulateController');

app.use(express.json());
app.use('/api', messageRoutes);
app.use('/api', accountRoutes);
app.use('/api', joinChannelRoutes);
app.use('/api', simulateRoutes);

module.exports = { app, server };