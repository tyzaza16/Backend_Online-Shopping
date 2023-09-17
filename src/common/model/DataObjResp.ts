import { HandlerStatus } from "../../Constant"

class DtoResp{
  private status: HandlerStatus = HandlerStatus.Failed;
  private message: string = '';

  setStatus(status: HandlerStatus): void{
    this.status = status;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getStatus(): HandlerStatus {
    return this.status;
  }

  getMessage(): string {
    return this.message;
  }

}

 
export { DtoResp }