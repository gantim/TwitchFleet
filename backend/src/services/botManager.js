const tmi = require('tmi.js');
const {
  getAvailableAccount,
  lockAccount,
  updateChannel,
  getActiveAccounts,
  pool
} = require('../models/accountModel');

const bots = {}; // username: tmi client
const connectedChannels = {}; // username: current_channel

async function connectAllToChannel(channel) {
  console.log('✅ Подключение к каналу:', channel);
  const accounts = await getActiveAccounts('chat');
  console.log('Найдено аккаунтов:', accounts.length);

  for (const acc of accounts) {
    const { username, oauth_token, id } = acc;

    if (!bots[username]) {
      bots[username] = new tmi.Client({
        identity: {
          username,
          password: oauth_token
        },
        connection: {
          reconnect: true,
          secure: true
        }
      });
    }

    try {
      await bots[username].connect();
      await bots[username].join(channel);
      connectedChannels[username] = channel;
      await updateChannel(id, channel);
      console.log(`[JOIN] ${username} присоединился к #${channel}`);
    } catch (err) {
      if (err?.message?.includes('authentication')) {
        console.error(`[BAD TOKEN] ${username}`);
        await pool.query('UPDATE accounts SET active = false WHERE id = $1', [id]);
      } else {
        console.error(`[JOIN ERROR] ${username}:`, err?.message || err);
      }
    }
  }
}

async function sendMessage(message) {
  const account = await getAvailableAccount(null); // любой бот с current_channel
  if (!account) throw new Error('Нет доступных ботов');

  const { username, oauth_token, id, current_channel: channel } = account;
  if (!channel) throw new Error('Бот не подключён ни к одному каналу');

  if (!bots[username]) {
    bots[username] = new tmi.Client({
      identity: {
        username,
        password: oauth_token
      },
      connection: {
        reconnect: true,
        secure: true
      }
    });
    await bots[username].connect();
  }

  try {
    await bots[username].say(channel, message);
    await lockAccount(id, 10);
    console.log(`[SEND] ${username} -> #${channel}: ${message}`);
  } catch (err) {
    console.error(`[SEND ERROR] ${username}:`, err);
    throw new Error(`Ошибка отправки от ${username}`);
  }
}

module.exports = {
  sendMessage,
  connectAllToChannel
};
