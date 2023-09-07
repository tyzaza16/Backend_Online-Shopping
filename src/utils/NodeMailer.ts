import nodeMailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface IAuthen { 
  user: string,
  pass: string
}

interface IConfig {
  service: string
  host?: string;
  port?: number;
  secure?: boolean;
  auth: IAuthen;
}

interface IAttachments {
  filename: string,
  path: string,
  cid: string
}
 
interface IMessage {
  from: string,
  to: string,
  subject: string,
  html: string,
  attachments: IAttachments[]
}

export class NodeMailer {

  public static transporter: Transporter<SMTPTransport.SentMessageInfo>;

  static initTransporter(config: IConfig): void {
    NodeMailer.transporter = nodeMailer.createTransport(config);
  }

  static sendMail(message: IMessage): Promise<SMTPTransport.SentMessageInfo> {
    
    // if transporter is not initialize
    if(!NodeMailer.transporter) {
      throw new Error('transporter not initialize');
    }

    return NodeMailer.transporter.sendMail(message);
  }
  
}