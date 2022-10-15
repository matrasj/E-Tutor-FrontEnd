import {UserPayloadModel} from "../user/user-payload-model";

export  class ReviewPayloadModel {
  constructor(public id : number,
              public content : string,
              public starsNumber : number,
              public createdAt : string,
              public user : UserPayloadModel
              ) {
  }
}
