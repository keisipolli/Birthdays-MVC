import fs from 'fs';

export function logEvent(event: string, data: any) {
    const log = {
        timestamp: new Date().toISOString(),
        event,
        data
    };
    const logEntry = JSON.stringify(log) + '\n';
    fs.appendFileSync('file.log', logEntry);
}