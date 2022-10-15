export class MessagePayloadRequestModel {
  constructor( public subject : string,
  public content : string,
  public senderId : number,
  public receiverId : number,
  public advertisementId : number) {
  }
}
