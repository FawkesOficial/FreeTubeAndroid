import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 80;
const DATA_DIR = path.resolve('/data');

await fs.mkdir(DATA_DIR, { recursive: true });


const allowedKeys = new Set([
    'settings.db',
    'profiles.db',
    'playlists.db',
    'history.db',
    'search-history.db',
    'subscription-cache.db'
]);

app.use(express.text({ type: '*/*', limit: '100mb' }));
app.use(express.static('./dist/web'));

app.get('/api/db/:key', async (req, res) => {
    const rawKey = req.params.key;
    const key = path.basename(rawKey);
    if (!allowedKeys.has(key)) return res.status(400).send('Invalid key');

    const filePath = path.join(DATA_DIR, key);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.type('text/plain').send(data);
    } catch (err) {
        if (err.code === 'ENOENT') return res.status(404).end();
        res.status(500).send(err.message);
    }
});

app.post('/api/db/:key', async (req, res) => {
    const rawKey = req.params.key;
    const key = path.basename(rawKey);
    if (!allowedKeys.has(key)) return res.status(400).send('Invalid key');

    const filePath = path.join(DATA_DIR, key);
    try {
        await fs.writeFile(filePath, req.body);
        res.status(200).end();
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
