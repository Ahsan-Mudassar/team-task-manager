import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import session from './config/session.js';
import errorHandler, { notFound } from './middlewares/errorHandler.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
if (isProd) app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });
app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes (baad mein)
// app.use('/api/auth', authRoutes);
// app.use('/api/teams', teamRoutes);
// app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;