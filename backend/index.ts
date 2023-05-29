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
import bodyParser from "body-parser";
import xmlparser from "express-xml-bodyparser";

dotenv.config();
const port: Number = Number(process.env.PORT) || 3000;
const app: Express = express();
const swaggerDocument: Object = YAML.load('./swagger.yaml');

//Add HTTPS support and key and certificate
import * as https from 'https';
import * as fs from 'fs';
const options = {
    key: fs.readFileSync('../certs/server.key'),
    cert: fs.readFileSync('../certs/server.cert'),
};

module.exports = {
    httpsServer: {
        key: fs.readFileSync('../certs/server.key'),
        cert: fs.readFileSync('../certs/server.cert'),
    },
}

// Middleware
const corsOptions = {
    origin: 'https://localhost:5173',
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

// Health check
app.get('/health-check', (req, res) => {
    res.status(200).send('OK');
});

const httpsServer = https.createServer(options, app).listen(port, () => {
    console.log(`Running at https://localhost:${port} and docs at https://localhost:${port}/docs`);
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

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});