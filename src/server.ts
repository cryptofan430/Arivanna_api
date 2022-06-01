import 'reflect-metadata';
import 'express-async-errors';
import express, {Request, Response, NextFunction} from 'express';
import {json, urlencoded} from 'body-parser';
var cors = require('cors')
// import * as dotenv from 'dotenv';

import router from './routes';

import './database';

// parsing the request
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
// PORT number
const PORT = process.env.PORT || 5000;

// Dotenv default config
// dotenv.config({ path: __dirname + '/.env' })

// using routes
app.use(router);

// Custom error handling
app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof Error) {
            return res.status(400).json({
                errora: err.message,
              });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
          })
    }
);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));