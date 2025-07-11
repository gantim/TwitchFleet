const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const userRouter = require('./routes/user.routes')
const adminRoutes = require('./routes/admin.routes');
const accountRoutes = require('./routes/account.routes');

dotenv.config()

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api', userRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', accountRoutes);

const start = async () => {
  try {
    server.listen(PORT, () => console.log(`Сервер слушает на http://localhost:${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()