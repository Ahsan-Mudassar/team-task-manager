import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

const isProd = process.env.NODE_ENV === 'production';
const PgSession = pgSession(session);

const store = process.env.DB_URL
  ? new PgSession({
      pool: new Pool({ connectionString: process.env.DB_URL }),
      createTableIfMissing: true,
    })
  : undefined;

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