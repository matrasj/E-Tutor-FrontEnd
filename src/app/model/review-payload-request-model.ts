export class ReviewPayloadRequestModel {
  constructor(public advertisementId : number,
              public authorId : number,
              public starsNumber : number,
              public content : string) {
  }
}
