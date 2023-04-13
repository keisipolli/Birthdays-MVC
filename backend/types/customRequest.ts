import { Request } from 'express';
import { User, Session } from '@prisma/client';

export interface CustomRequest extends Request {
    user?: User;
    session?: Session;
}
