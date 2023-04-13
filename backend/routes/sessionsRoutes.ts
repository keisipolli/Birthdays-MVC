import express, {NextFunction, Request, Response} from 'express';
import {handleErrors} from './handleErrors';
import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import { CustomRequest } from '../types/customRequest';
//import { auth } from '../middleware/auth';


const {v4: uuidv4} = require('uuid');
const verifier = require('@gradeup/email-verify');
const prisma = new PrismaClient();
const router = express.Router();


// Routes
router.post('/', handleErrors (
    async (req: Request, res: Response) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                },
            });
            console.log(user)
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
                data: {userId: user.id, id: uuidv4()},
            });
            res.status(201).send(session);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
));


// Delete session
router.delete('/', handleErrors(
    async (req: Request, res: Response) => {
        try {
            const session = await prisma.session.delete({
                where: {id: req.body.id},
            });
            res.status(200).send(session);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }
));

// async function authorizeRequest(req: CustomRequest, res: Response, next: NextFunction) {
//     // Check that there is an authorization header
//     if (!req.headers.authorization) return res.status(401).send('Missing authorization header')
//
//     // Check that the authorization header is in the correct format
//    const authorizationHeader = req.headers.authorization.split(' ')
//    if (authorizationHeader.length !== 2 || authorizationHeader[0] !== 'Bearer') return res.status(400).send('Invalid authorization header')
//
//     // Get sessionId from authorization header
//    const sessionId = authorizationHeader[1]
//
//     // Find session in database
//    const session = await prisma.session.findUnique({
//        where: {
//            id: sessionId,
//        },
//    })
//    if (!session) return res.status(401).send('Invalid session')
//
//     // Check that the user exists
//   const user = await prisma.user.findUnique({
//       where: {
//            id: session.userId,
//        },
//    })
//    if (!user) return res.status(401).send('Invalid session')
//
//     // Add user to request object
//    req.user = user
//
//     // Add session to request object
//    req.session = session
//
//     // Call next middleware
//    next()
// }

//module.exports = authorizeRequest

export default router;
