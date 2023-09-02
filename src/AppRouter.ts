import express from 'express';

// singleton class 
export class AppRouter {
  private static instance: express.Router

  static getInstance(): express.Router {

    // don't have router 
    if(!AppRouter.instance) {
      AppRouter.instance = express.Router();
    }

    return AppRouter.instance;
  }
}