import {UserPayloadModel} from "../user/user-payload-model";

export class MessagePayloadResponseModel {
  constructor( public id : number,
  public advertisementId : number,
  public sender : UserPayloadModel,
  public receiver : UserPayloadModel,
  public subject : string,
  public content : string,
  public seen : string,
  public createdAt : string) {
  }
}
