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

const DB_URI = process.env.DB_URI;
const SERVER_PORT = process.env.SERVER_PORT;

export { DB_URI,SERVER_PORT };