import express, { NextFunction, Request, Response } from 'express';
import { handleErrors } from './handleErrors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { logEvent } from '../logger';

const { v4: uuidv4 } = require('uuid');
const verifier = require('@gradeup/email-verify');
const prisma = new PrismaClient();
const router = express.Router();

// Routes
router.post(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email,
                },
            });
            console.log(user);
            if (!user) return res.status(404).send('User not found');

            if (user.password === null) {
                return res.status(401).send('Password not set');
            }

            const passwordMatches = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!passwordMatches) return res.status(401).send('Invalid password');

            const session = await prisma.session.create({
                data: { userId: user.id, id: uuidv4() },
            });

            logEvent('Sign-in', { userId: user.id });

            res.status(201).send(session);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    })
);

// Delete session
router.delete(
    '/',
    handleErrors(async (req: Request, res: Response) => {
        try {
            const sessionId = req.headers.authorization;
            if (!sessionId) {
                return res.status(401).send('Session ID not provided');
            }
            console.log('Session ID to delete:', sessionId);
            const session = await prisma.session.findUnique({
                where: { id: sessionId.substring(7) },
            });
            if (!session) {
                return res.status(404).send('Session not found');
            }
            await prisma.session.delete({
                where: { id: sessionId.substring(7) },
            });

            logEvent('Sign-out', { sessionId: session.id });

            res.status(200).send(session);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    })
);

export default router;