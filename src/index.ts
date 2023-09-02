import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import { SERVER_PORT } from './utils/loadEnvirontment';
import cors from 'cors';
import { connectDB } from './db/connect';

import './controller/LoginController';
import './controller/RootController';


const app = express();

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['sadasd']}));
app.use(cors());
app.use(AppRouter.getInstance());



app.listen(SERVER_PORT, () => {
   console.log(`Listen on port ${SERVER_PORT}...`);
});
