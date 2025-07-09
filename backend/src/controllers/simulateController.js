const express = require('express');
const router = express.Router();
const {
  getActiveAccounts,
  updateChannel,
  lockAccount
} = require('../models/accountModel');
const tmi = require('tmi.js');

const activeClients = {}; // username: tmi client

const hahaMessages = [
  'ха', 'хахаха', 'хахпа', 'ХАХА', 'ХАХАХАХА',
  'хПХПХ', 'ххахпвз', 'ХпавХвз', 'хааахааа',
  'хапрхзващпщхза', 'хвзпахвза', 'хвхпхвхв',
  'дмтпхвазп', 'хвхпахзап', 'хвазпщ', 'хзщхарп',
  'зщпавхпщхвапщх', 'ХЗПЩХЗВАЩПХВЩАПХ', 'хзщхзапщхвазщпХ', 'ЩХВАЗЩПхзпхав',
  'Хщхавпщ', 'хзщпхавзщ', 'пидтбхзавщпхапзрщ', 'хзхвхавххав',
  'хахвах', 'хавххавх', 'хзхахвах', 'зхвахзав',
  'ПЩХЗпвщапвщХ', 'зщавхзпщх', 'вщзахпщхав', 'щхзапхвщаз',
  'щахпзрщав', 'щзпахвхзщ', 'зхпзавщпх', 'щахзпвщпхв',
  'ПЗЩХВАЩ', 'щхвзпщхав', 'зщапхвщапх', 'хвщпзахщ',
  'щазпхвхзп', 'хзпщахвзп', 'щзахпвщп', 'хщазвщпхз',
  'зщпхавхщп', 'щзахвпщахз', 'щзхпвщахз', 'зщапвхщах',
  'щпхзавщах', 'зщхавпзщх', 'щпзахвщах', 'пзщахвщах',
  'щазпхвщах', 'щахпвзщах', 'щахзпвщах', 'зпщахвщах',
  'зщахвщахз', 'хзпщахвщз', 'щазвхпзщах', 'щпзахвщхз',
  'щзахвпщпз', 'зщхавпщах', 'зщахпвщах', 'щазвпщах',
  'щпхзавщах', 'зщахвпщах', 'щахвпщахз', 'пщахвзщах',
  'хпзщахвщз', 'щахпвщахз', 'зпщахвщах', 'зщахвщпах',
  'пзщахвщах', 'щазвпщахз', 'щахпвщахз', 'пщахвщахз',
  'щахпвщахп', 'щахпвщахв', 'зщахвщахп', 'щахвщахпз',
  'зщахвщахв', 'щахвщахвз', 'щахвщахзп', 'щахвщахзз',
  'щахвщаххз', 'щахвщаххх', 'щахвщаххп', 'щахвщаххв',
  'щахвщахпп', 'щахвщахпв', 'щахвщахпз', 'щахвщахпх',
  'щахвщахвв', 'щахвщахвп', 'щахвщахвз', 'щахвщахвх',
  'щахвщахзз', 'щахвщахзп', 'щахвщахзв', 'щахвщахзх',
  'щахвщаххх', 'щахвщаххп', 'щахвщаххв', 'щахвщаххз',
  'щахвщаххх', 'щахвщаххх', 'щахвщаххх', 'щахвщаххх',
  'щахвщаххх', 'щахвщаххх', 'щахвщаххх', 'щахвщаххх',
  'хахахахахаха', 'АХАХАХАХА', 'ХПЗХВЗПАХЗП', 'ПХАВЩПХА',
  'ЩПХЗПАВХЗ', 'ЗХАВЩПХА', 'ПХАВЗПХЩ', 'ЩАХПЗАВХПЗ',
  'ХПАВЩХЗП', 'АХПВЩЗПА', 'ЩПАВЗХПЩ', 'ПАХЩПЗАВ',
  'ЗПХАЩВПЗА', 'ЗХПАЩВПА', 'ХПАЩВПЗА', 'ЩЗПАХПВЗ',
  'ПАЩЗХПВА', 'АЩПХВЗПА', 'ЩПАВХЗПА', 'ПАЩХЗПВА',
  'ЩПАХВЗПА', 'ХЗПАЩВПА', 'ЗПАХЩПВА', 'ПАХЗПВЩА',
  'ЗХПАЩПВА', 'ПАХЗПВЩА', 'ХАХЗПАЩП', 'ПЩХАВЗЩА',
  'ЗАХПЩВПА', 'ЩХПАВЗПА', 'ПХАЩПВЗА', 'АХПЩЗВПА',
  'ЩПАХЗПВЩ', 'ПАХЗПВЩА', 'ЗПАЩХВПА', 'АХЩПЗВПА',
  'ПАЩЗХПВА', 'ЗАХПВЩПА', 'ЩАХПВЗПА', 'ПАХЗЩПВА',
  'ЩАХЗПВПА', 'ПАХЩЗВПА', 'АЩПХВЗПА', 'ЗПАХВЩПА',
  'ПАХЗПЩВА', 'ПАХЗЩПВА', 'АХПЗВПЩА', 'ПАЩЗВПХА',
  'ПХАЩЗПВА', 'ЗПАХВЩПА', 'ЩАХПЗВПА', 'ЗАХПЩПВА',
  'ЩАХПВЗПА', 'ПХАЩПВЗА', 'ЩПАХЗВПА', 'ЗПАХЩПВА',
  'ПАХЗПЩВА', 'АЩПХЗПВА', 'ЩАХЗПВПА', 'ЗПАХЩПВА',
  'ПХАЩЗПВА', 'ЩАХПЗВПА', 'ПАХЗПЩВА', 'АЩПХВЗПА',
  'ПАХЗПЩВА', 'ЩАХПВЗПА', 'ПАХЗЩПВА', 'ЗПАХЩПВА',
  'ПАХЗЩПВА', 'АХПЗЩПВА', 'ПАХЩЗПВА', 'ЩПАХЗВПА'
];

function randomHaha() {
  return hahaMessages[Math.floor(Math.random() * hahaMessages.length)];
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

router.post('/simulate/haha', async (req, res) => {
  try {
    const all = await getActiveAccounts('chat');
    const available = all.filter(acc =>
      acc.current_channel &&
      (!acc.locked_until || new Date(acc.locked_until) < new Date())
    );

    const selected = available.filter(() => Math.random() < 0.7); // 90%

    for (const acc of selected) {
      const { username, oauth_token, id, current_channel } = acc;

      if (!activeClients[username]) {
        activeClients[username] = new tmi.Client({
          identity: {
            username,
            password: oauth_token
          },
          connection: { reconnect: true, secure: true }
        });

        try {
          await activeClients[username].connect();
        } catch (e) {
          console.error(`[ХАХА-CONNECT] ${username}:`, e.message);
          continue;
        }
      }

      const client = activeClients[username];
      const msg = randomHaha();

      try {
        await client.say(current_channel, msg);
        await lockAccount(id, 10);
        console.log(`[ХАХА] ${username} -> #${current_channel}: ${msg}`);
      } catch (err) {
        console.error(`[ХАХА-ошибка] ${username}:`, err.message);
      }

      const randomDelay = Math.floor(Math.random() * 2000); // 0–2 сек (в среднем ~0.5)
      await delay(randomDelay);
    }

    res.json({ success: true, bots: selected.length });
  } catch (err) {
    console.error('[simulate/haha]', err);
    res.status(500).json({ error: 'Ошибка при запуске ХАХА-атаки' });
  }
});

module.exports = router;
