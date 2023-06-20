import { Server as SocketIOServer } from 'socket.io';
import express, {Express, NextFunction, Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import {Error} from './types';
import * as dotenv from 'dotenv';
import usersRoutes from "./routes/usersRoutes";
import cors from 'cors';
import sessionsRoutes from "./routes/sessionsRoutes";
import birthdaysRoutes from "./routes/birthdaysRoutes";
import oauthRoutes from "./routes/oauthRoutes";
import bodyParser from "body-parser";
import xmlparser from "express-xml-bodyparser";
import logsRoutes from './routes/logsRoutes';

dotenv.config();
const port: Number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

//Add HTTPS support and key and certificate
import * as https from 'https';
import * as fs from 'fs';
const options = {
    key: fs.readFileSync('certs/server.key'),
    cert: fs.readFileSync('certs/server.cert'),
};

module.exports = {
    httpsServer: {
        key: fs.readFileSync('certs/server.key'),
        cert: fs.readFileSync('certs/server.cert'),
    },
}

// Get baseUrl from ../cypress.config.ts
import cypressConfig from '../cypress.config';
let baseUrl = cypressConfig?.e2e?.baseUrl;

// Check if baseUrl is set
if (!baseUrl) {
    throw new Error('baseUrl is not set in cypress.config.ts');
}

// Trim trailing slash
if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
}

// Middleware
const corsOptions = {
    origin: baseUrl,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.xml());
app.use(xmlparser());
app.use(express.static('public'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    return res.status(err.statusCode || 500).send(err.message || 'Internal Server Error');
});

// Routes
app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/birthdays', birthdaysRoutes);
app.use('/', oauthRoutes);
app.use('/log', logsRoutes);

// Health check
app.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

const httpsServer = https.createServer(options, app).listen(port, () => {
    //console.log(Running at https://localhost:${port} and docs at https://localhost:${port}/docs);
});

const io = new SocketIOServer(httpsServer, {
    cors: corsOptions
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle socket events
    socket.on('birthdayAdded', (newBirthday) => {
        console.log('birthdayAdded', newBirthday);
        socket.broadcast.emit('birthdayAdded', newBirthday);
    });

    socket.on('birthdayDeleted', (id) => {
        console.log('birthdayDeleted', id);
        socket.broadcast.emit('birthdayDeleted', id);
    });

    socket.on('birthdayUpdated', (updatedBirthday) => {
        console.log('birthdayUpdated', updatedBirthday);
        socket.broadcast.emit('birthdayUpdated', updatedBirthday);
    });

    socket.on('login', (sessionId) => {
        console.log('login', sessionId);
        //add session id to all clients
        socket.broadcast.emit('login', sessionId);
    });

    socket.on('logout', (sessionId) => {
        console.log('logout', sessionId);
        //remove session id from all clients
        socket.broadcast.emit('logout', sessionId);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
