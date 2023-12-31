import * as dotenv from 'dotenv';

// loading env variable
const result = dotenv.config();

// if something err log to me
if(result.error) {
  throw result.error;
}

// if DB_URI is not exist
if(!process.env.DB_URI) {
  throw new Error('DB_URI is not exist in env file');
}

// if DB_URI is not exist
if(!process.env.SERVER_PORT) {
  throw new Error('SERVER_PORT is not exist in env file');
}

if(!process.env.EMAIL_USERNAME) {
  throw new Error('EMAIL_USER is not exist in env file');
}

if(!process.env.EMAIL_APP_PASSWORD) {
  throw new Error('EMAIL_APP_PASSWORD is not exist in env file');
}

if(!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not exist in env file');
}

if(!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET is not exist in env file');
}


const DB_URI: string = process.env.DB_URI;
const SERVER_PORT: string = process.env.SERVER_PORT;
const EMAIL_USERNAME: string = process.env.EMAIL_USERNAME;
const EMAIL_APP_PASSWORD: string = process.env.EMAIL_APP_PASSWORD;
const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;

export { 
  DB_URI,
  SERVER_PORT,
  EMAIL_USERNAME,
  EMAIL_APP_PASSWORD,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
};