import Mailgen from "mailgen";
import { APP_HOST, APP_NAME} from "./loadEnvirontment";

interface IBody {
  body: {
    name: string,
    intro: string,
    action?: {
        instructions?: string,
        button?: {
            color?: string, 
            text?: string,
            link?: string
        }
    }
  }
}


class MailGenerator {
  
  initMailGenerator(): Mailgen {
    return new Mailgen({
      theme: 'default',
      product: {
        name: APP_NAME,
        link: APP_HOST
      }
    });
  }

}