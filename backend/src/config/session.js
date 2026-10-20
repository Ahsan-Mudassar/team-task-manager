import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

const isProd = process.env.NODE_ENV === 'production';
const useMemory = process.env.SESSION_STORE === 'memory';
const PgSession = pgSession(session);

const store = useMemory
  ? undefined
  : new PgSession({
    pool: new Pool({ connectionString: process.env.DB_URL }),
    createTableIfMissing: true,
  });

export default session({
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});