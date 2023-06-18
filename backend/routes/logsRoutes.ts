import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const logs = fs.readFileSync('file.log', 'utf-8');
        res.status(200).send(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Error fetching logs');
    }
});

export default router;