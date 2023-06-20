import { Request, Response, NextFunction, Express } from 'express';
import bodyParser from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml';

const configureXmlJsonSupport = (app: Express): void => {
    app.use(bodyParser.json());
    app.use(xmlparser({
        explicitArray: false, // This will set array to false
    }));

    // Middleware for overloading res.send to support XML
    app.use(((req: Request, res: Response, next: NextFunction): void => {
        const oldSend = res.send;

        res.send = (body: any): any => {
            if (req.accepts('application/json')) {
                res.header('Content-Type', 'application/json');
                oldSend.call(res, body);
            } else if (req.accepts('application/xml')) {
                res.header('Content-Type', 'application/xml');
                let xmlBody = typeof body === 'string' ? body : xml(convertToXMLFormat(body));
                oldSend.call(res, xmlBody);
            } else {
                res.status(415).send('Unsupported media type');
            }
        };

        // Add the Authorization header with session ID to the request headers if it exists
        if (req.headers.authorization) {
            const sessionId = req.headers.authorization.replace('Bearer ', '');
            if (sessionId) {
                req.headers.authorization = `Bearer ${sessionId}`;
            } else {
                delete req.headers.authorization; // Remove the invalid authorization header
            }
        }

        next();
    }));

    // Convert JS Object to XML format
    function convertToXMLFormat(obj: any): any {
        return Object.keys(obj).map(key => {
            if (typeof obj[key] === 'object') {
                return { [key]: convertToXMLFormat(obj[key]) };
            } else {
                return { [key]: obj[key] };
            }
        });
    }
};

export default configureXmlJsonSupport;
