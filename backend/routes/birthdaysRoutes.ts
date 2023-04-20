import express from 'express';
import { PrismaClient } from '@prisma/client';
import { handleErrors } from './handleErrors';

const prisma = new PrismaClient();
const router = express.Router();

interface CustomRequest extends express.Request {
    user?: { id: number };
}

// Middleware function to verify session
const verifySession = async (
    req: CustomRequest,
    res: express.Response,
    next: express.NextFunction
) => {
    const sessionId = req.headers.authorization;
    console.log('sessionId:', sessionId);
    if (!sessionId) {
        return res.status(401).send('Unauthorized');
    }
    const session = await prisma.session.findUnique({
        where: { id: sessionId.substring(7) },
        include: { user: true },
    });
    console.log('session:', session);
    if (!session || !session.user) {
        return res.status(401).send('Unauthorized');
    }
    req.user = { id: session.user.id };
    next();
};

// POST
router.post(
    '/',
    verifySession,
    handleErrors(async (req: CustomRequest, res) => {
        const userId = req.user?.id;
        console.log('userId:', userId);
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const { name, date } = req.body;
        console.log('name:', name, 'date:', date);

        if (!name || !date) {
            return res.status(400).send('Bad Request: Name and date fields are required');
        }

        const birthday = await prisma.birthday.create({
            data: {
                name,
                date: new Date(date), // convert the string to a DateTime object
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        console.log('birthday:', birthday);

        res.status(201).send(birthday);
    })
);


// DELETE
router.delete(
    '/:id',
    verifySession,
    handleErrors(async (req: CustomRequest, res) => {
        const userId = req.user?.id;
        console.log('userId:', userId);
        if (!userId) {
            console.log('User is unauthorized');
            return res.status(401).send('Unauthorized');
        }

        const birthdayId = req.params.id;
        console.log('birthdayId:', birthdayId);
        if (!birthdayId) {
            console.log('Bad request: birthday ID missing');
            return res.status(400).send('Bad Request: birthday ID missing');
        }

        const birthday = await prisma.birthday.findUnique({
            where: {
                id: `${birthdayId}`,
            },
        });
        console.log('birthday:', birthday);

        if (!birthday || birthday.userId !== userId) {
            console.log('Birthday not found or user is not authorized to delete it');
            return res.status(404).send('Birthday not found');
        }

        await prisma.birthday.delete({
            where: {
                id: `${birthdayId}`,
            },
        });
        console.log('Birthday deleted');

        res.status(204).send();
    })
);

// PATCH
router.patch(
    '/:id',
    verifySession,
    handleErrors(async (req: CustomRequest, res) => {
        const userId = req.user?.id;
        console.log('userId:', userId);
        if (!userId) {
            console.log('Unauthorized: user ID is missing');
            return res.status(401).send('Unauthorized');
        }

        const birthdayId = req.params.id;
        console.log('birthdayId:', birthdayId);
        const birthday = await prisma.birthday.findUnique({
            where: {
                id: `${birthdayId}`,
            },
        });
        console.log('birthday:', birthday);

        // Move the check for existence of birthday here
        if (!birthday) {
            console.log('Birthday not found: the specified ID does not exist');
            return res.status(404).send('Birthday not found');
        }

        if (birthday.userId !== userId) {
            console.log('Birthday not found: user ID does not match');
            return res.status(404).send('Birthday not found');
        }

        const { name, date } = req.body;
        console.log('name:', name, 'date:', date);

        const updatedBirthday = await prisma.birthday.update({
            where: { id: birthdayId },
            data: {
                name,
                date: new Date(date), // convert the string to a DateTime object
            },
        });
        console.log('updatedBirthday:', updatedBirthday);

        res.status(200).send(updatedBirthday);
    })
);


// GET
router.get(
    '/',
    verifySession,
    handleErrors(async (req: CustomRequest, res) => {
        const userId = req.user?.id;
        console.log('userId:', userId);
        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const birthdays = await prisma.birthday.findMany({
            where: {
                user: {
                    id: userId
                }
            },
        });
        console.log('birthdays:', birthdays);

        res.status(200).send(birthdays);
    })
);

export default router;