import { NextFunction, Request, Response} from 'express';
import { controller, get, use } from './decorators';
import { UserModel } from '../db/model/userModel';

// function requireAuth(req: Request, res: Response, next: NextFunction) {
//   if(req.session && req.session.loggedIn) {
//     next();
//     return;
//   }

//   res.status(403);
//   res.send(`
//     Not permitted
//   `)
// }


@controller('')
class RootController {

  @get('/')
  getRoot(req: Request, res: Response) {
    res.send('Welcome to API Home...');
  }

  @get('/protected')
  // @use(requireAuth)
  getProtected(req: Request, res: Response) {
    res.send('Welcome to protected route, logged in user');
  }
}