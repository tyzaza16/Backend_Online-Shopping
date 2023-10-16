import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import { SERVER_PORT } from './utils/loadEnvirontment';
import cors from 'cors';
import { connectDB } from './db/connect';
import passport from 'passport';
import session from 'express-session';

import './controller';

const app = express();

connectDB();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(cookieSession({ name: "session",keys: ['sadasd']}));
app.use(session({
   secret: 'party secret',
   resave: false,
   saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(AppRouter.getInstance());



app.listen(SERVER_PORT, () => {
   console.log(`Listen on port ${SERVER_PORT}...`);
});
