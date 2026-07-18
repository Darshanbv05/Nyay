import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ''))) return callback(null, true);
    return callback(Object.assign(new Error('Origin is not allowed by CORS.'), { status: 403 }));
  }
}));
app.use(express.json({ limit: '2mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'nyay-api' }));
app.use('/api', analyzeRouter);
app.use((err, _req, res, _next) => { console.error(err); res.status(err.status || 500).json({ error: err.status ? err.message : 'Analysis temporarily unavailable. Please retry.' }); });
const port = Number(process.env.PORT) || 3001;
if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`Nyay API listening on http://localhost:${port}`));
export default app;
