export class AdvertisementPayloadLightModel {
  constructor(public id : number,
  public profileImagePath : string,
  public subjectName : string,
  public price : number,
  public minutesDuration : number,
  public placesNames : string[],
  public reviewsQuantity : number,
  public advertisementType : string) {
  }
}
