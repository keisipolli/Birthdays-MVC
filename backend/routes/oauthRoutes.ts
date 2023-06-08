import express, { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';

const router = express.Router();
const googleOAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();

// Google sign-in route
router.post('/google-login', async (req: Request, res: Response) => {
    try {
        const token = req.body.token;
        const payload = await getDataFromGoogleJwt(token);

        if (payload) {
            const userEmail = await prisma.user.findUnique({
                where: { email: payload.email },
            });

            if (userEmail) {
                const session = await prisma.session.findFirst({
                    where: { userId: userEmail.id, id: undefined },
                });

                if (session) {
                    return res.status(201).send({ sessionId: session.id });
                } else {
                    const createdSession = await prisma.session.create({
                        data: { userId: userEmail.id, id: uuid() },
                    });
                    return res.status(201).send({ sessionId: createdSession.id });
                }
            } else {
                const hashedPassword = await bcrypt.hash(payload.sub, 10);
                const user = await prisma.user.create({
                    data: {
                        email: payload.email,
                        password: hashedPassword,
                    },
                });
                const createdSession = await prisma.session.create({
                    data: { userId: user.id, id: uuid() },
                });
                return res.status(201).send({ sessionId: createdSession.id });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});

async function getDataFromGoogleJwt(token: string) {
    try {
        const ticket = await googleOAuth2Client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return payload;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default router;