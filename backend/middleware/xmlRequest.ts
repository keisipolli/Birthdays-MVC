import { NextFunction, Request, Response } from 'express';
import xml2js from 'xml2js';

const parser = new xml2js.Parser();

const configureXmlRequest = (req: Request, res: Response, next: NextFunction) => {
    if (req.is('xml')) {
        let xmlData = '';

        req.on('data', (chunk) => {
            xmlData += chunk.toString();
        });

        req.on('end', () => {
            parser.parseString(xmlData, (err, result) => {
                if (err) {
                    next(err);
                } else {
                    console.log('Parsed XML Result:', result);

                    const rootElement = Object.keys(result)[0];

                    if (rootElement === 'NewBirthday') {
                        console.log('Root Element:', rootElement);

                        const { name, date } = result[rootElement];
                        req.body = { name: name[0], date: date[0] };
                        next();
                    } else {
                        const error = new Error('Invalid XML structure');
                        next(error);
                    }
                }
            });
        });

    } else {
        next();
    }
};

export default configureXmlRequest;
