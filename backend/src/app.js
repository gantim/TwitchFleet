const express = require('express')
const helmet = require('helmet')
const dotenv = require('dotenv')
const pool = require('./config/db')
const authRouter = require('./routes/auth.routes')
const accountRoutes = require('./routes/account.routes')
const userRoutes = require('./routes/users.routes')
const logsRoutes = require('./routes/logs.routes')
// const scriptsRoutes = require('./routes/scripts.routes')

dotenv.config()

const app = express()

pool.query('SELECT NOW()', (err, res) => {
  if(err){
    console.error('Не удалось подключиться к базеданных.', err.stack)
  } else {
    console.log('Успешное подключение к базеданных:', res.rows)
  }
})

app.use(express.json())
app.use(helmet())

app.use('/api/auth', authRouter)
app.use('/api/accounts', accountRoutes)
app.use('/api/users', userRoutes)
app.use('/api/logs', logsRoutes)
// app.use('/api/scripts', scriptsRoutes)

module.exports = app