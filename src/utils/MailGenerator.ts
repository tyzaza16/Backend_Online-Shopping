import Mailgen from "mailgen";
import { Application } from "../Constant";

export class MailGenerator {
  
  static initMailGenerator(): Mailgen {
    return new Mailgen({
      theme: 'default',
      product: {
        name: Application.Name,
        link: Application.Host
      }
    });
  }

}