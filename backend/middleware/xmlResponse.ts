import { Request, Response, NextFunction, Express } from 'express';
import xml from 'xml';

const configureXmlSupport = (app: Express): void => {
    app.use((req: Request, res: Response, next: NextFunction): void => {
        const oldSend = res.send;

        res.send = (body: any): any => {
            if (req.accepts('application/json')) {
                res.header('Content-Type', 'application/json');
            } else if (req.accepts('application/xml')) {
                res.header('Content-Type', 'application/xml');
                const xmlBody = xml(convertToXMLFormat(body), { declaration: true });
                return res.status(200).send(xmlBody); // Send XML response
            } else {
                res.status(415).send('Unsupported media type');
            }

            // Let Express handle the response for JSON
            oldSend.call(res, body);
        };

        next();
    });

    function convertToXMLFormat(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(convertToXMLFormat);
        } else if (typeof obj === 'object') {
            return Object.keys(obj).map((key) => {
                if (typeof obj[key] === 'object') {
                    return { [key]: convertToXMLFormat(obj[key]) };
                } else {
                    return { [key]: obj[key] };
                }
            });
        } else {
            return obj;
        }
    }
};

export default configureXmlSupport;
