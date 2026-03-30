import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { searchVideos } from './services/videoSearchService';

const app = express();

app.use(express.json({ limit: '256kb' }));
app.use(
  cors({
    origin: true,
  }),
);

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});

const videoSearchBodySchema = z.object({
  query: z.string().min(1).max(300),
});

app.post('/api/video-search', async (req, res) => {
  const parsed = videoSearchBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request body', details: parsed.error.flatten() });
  }

  try {
    const result = await searchVideos({ userQuery: parsed.data.query });
    return res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // Keep a server-side log so debugging 500s is straightforward.
    console.error('video-search error:', message);
    return res.status(500).json({ error: 'Search failed', message });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});

