const express = require('express')
const helmet = require('helmet');
const dotenv = require('dotenv')
// const pool = require('./config/db')
const authRouter = require('./routes/auth.routes')
// const adminRoutes = require('./routes/admin.routes');
// const accountRoutes = require('./routes/account.routes');

dotenv.config()

const app = express()

// pool.query('SELECT NOW()', (err, res) => {
//   if(err){
//     console.error('Не удалось подключиться к базеданных.', err.stack); 
//   } else {
//     console.log('Успешное подключение к базеданных:', res.rows);
//   }
// })

app.use(express.json())
app.use(helmet());

app.use('/api/auth', authRouter);
// app.use('/api/admin', adminRoutes);
// app.use('/api/admin', accountRoutes);

module.exports = app;