import { Pool } from 'pg';
import { pgPoolConfig } from './dbConfig.js';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

const isProd = process.env.NODE_ENV === 'production';
const PgSession = pgSession(session);
const useMemory = process.env.SESSION_STORE === 'memory';

const store = useMemory
  ? undefined
  : new PgSession({ pool: new Pool(pgPoolConfig), createTableIfMissing: true });

export default session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: isProd ? 'none': 'lax',
    secure: isProd ,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});