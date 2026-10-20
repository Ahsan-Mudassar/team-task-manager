import './config/passport.js'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authLimiter } from './middlewares/rateLimiter.js';
import passport from 'passport';
import session from './config/session.js';
import authRoutes from './routes/auth.routes.js';
import teamRoutes from './routes/team.routes.js';
import errorHandler, { notFound } from './middlewares/errorHandler.js';
import isAuthenticated from './middlewares/isAuthenticated.js';

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

app.use('/api/auth', authLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/teams', isAuthenticated, teamRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;