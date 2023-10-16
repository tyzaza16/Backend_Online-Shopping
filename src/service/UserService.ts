import { Response,Request } from 'express';
import { UserModel,User } from '../db/model/userModel';

export class UserService {


  static async findUserById(id: string): Promise<User | null> {

    const user: User | null = await UserModel.findById(id);
    return user;

  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const user: User | null = await UserModel.findOne({ email });
    return user;
  }
}