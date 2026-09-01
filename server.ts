import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Jina Reader Webpage Extraction Proxy Endpoint
  app.post('/api/fetch-page', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'A valid URL is required.'
        });
      }

      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // Validate URL format
      try {
        new URL(formattedUrl);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Unable to verify this website right now. Invalid URL format.'
        });
      }

      const jinaEndpoint = `https://r.jina.ai/${formattedUrl}`;
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'X-No-Cache': 'true',
        'X-Timeout': '15',
        'User-Agent': 'CompeteWatch-RealMonitor/1.0'
      };

      if (process.env.JINA_API_KEY && process.env.JINA_API_KEY.trim()) {
        headers['Authorization'] = `Bearer ${process.env.JINA_API_KEY.trim()}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(jinaEndpoint, {
        method: 'GET',
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`Jina Reader returned status ${response.status} for ${formattedUrl}`);
        return res.status(502).json({
          success: false,
          error: 'Unable to verify this website right now.'
        });
      }

      const contentType = response.headers.get('content-type') || '';
      let resultData: {
        title?: string;
        description?: string;
        url?: string;
        content?: string;
        raw?: string;
      } = {};

      if (contentType.includes('application/json')) {
        const json = await response.json();
        if (json && json.data) {
          resultData = {
            title: json.data.title || '',
            description: json.data.description || '',
            url: json.data.url || formattedUrl,
            content: json.data.content || ''
          };
        } else if (json && json.content) {
          resultData = {
            title: json.title || '',
            description: json.description || '',
            url: json.url || formattedUrl,
            content: json.content || ''
          };
        }
      } else {
        const text = await response.text();
        resultData = {
          title: '',
          description: '',
          url: formattedUrl,
          content: text
        };
      }

      if (!resultData.content || resultData.content.trim().length === 0) {
        return res.status(502).json({
          success: false,
          error: 'Unable to verify this website right now.'
        });
      }

      return res.json({
        success: true,
        sourceUrl: formattedUrl,
        fetchedAt: new Date().toISOString(),
        data: resultData
      });
    } catch (error: any) {
      console.error('Error fetching page via Jina Reader:', error?.message || error);
      return res.status(502).json({
        success: false,
        error: 'Unable to verify this website right now.'
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CompeteWatch server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
