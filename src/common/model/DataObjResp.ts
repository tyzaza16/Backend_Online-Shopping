import { HandlerStatus } from "../../Constant"

class DtoResp{
  private status: boolean = HandlerStatus.Failed;
  private message: string = '';

  setStatus(status: boolean): void{
    this.status = status;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getStatus(): boolean {
    return this.status;
  }

  getMessage(): string {
    return this.message
  }

}

 
export { DtoResp }