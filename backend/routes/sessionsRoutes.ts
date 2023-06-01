import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import logger from "../middleware/logger";


const {v4: uuidv4} = require('uuid');
const verifier = require('@gradeup/email-verify');
const prisma = new PrismaClient();
const router = express.Router();


// Routes
router.post('/', handleErrors(
    async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email) {
                return res.status(400).send('Email is required');
            }

            if (!password) {
                return res.status(400).send('Password is required');
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });

            logger.info(user)

            if (!user) {
                return res.status(404).send('User not found');
            }

            if (user.password === null) {
                return res.status(401).send('Password not set');
            }

            const passwordMatches = await bcrypt.compare(password, user.password);

            if (!passwordMatches) {
                return res.status(401).send('Invalid password');
            }

            const session = await prisma.session.create({
                data: { userId: user.id, id: uuidv4() },
            });

            res.status(201).send(session);
        } catch (error) {
            logger.error(error);
            res.status(500).send('Internal server error');
        }
    }
));


// Delete session
router.delete('/', handleErrors(
    async (req: Request, res: Response) => {
        try {
            const sessionId = req.headers.authorization;
            if (!sessionId) {
                return res.status(401).send('Session ID not provided');
            }
            logger.info("Session ID to delete:", sessionId);
            const session = await prisma.session.findUnique({
                where: { id: sessionId.substring(7) },
            });
            if (!session) {
                return res.status(404).send('Session not found');
            }
            await prisma.session.delete({
                where: { id: sessionId.substring(7) },
            });
            res.status(200).send(session);
        } catch (error) {
            logger.error(error);
            res.status(500).send('Internal server error');
        }
    }
));

export default router;