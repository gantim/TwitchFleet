CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);

CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  oauth_token TEXT NOT NULL,
  type TEXT,
  active BOOLEAN DEFAULT TRUE,
  current_channel TEXT,
  locked_until TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_accounts (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, account_id)
);

CREATE TABLE connection_logs (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('connect', 'disconnect')),
  timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE message_logs (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

список всех ботов по id:
SELECT u.id, u.username, a.id AS account_id, a.username AS account_username
FROM users u
LEFT JOIN user_accounts ua ON u.id = ua.user_id
LEFT JOIN accounts a ON ua.account_id = a.id;

список ботов доступных пользователю:
SELECT a.*
FROM accounts a
JOIN user_accounts ua ON a.id = ua.account_id
WHERE ua.user_id = 163;