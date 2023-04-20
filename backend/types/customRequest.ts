import { Request } from 'express';
import { User, Session, Birthday } from '@prisma/client';

export interface CustomRequest extends Request {
    user?: User;
    session?: Session;
    birthday?: Birthday;
}
