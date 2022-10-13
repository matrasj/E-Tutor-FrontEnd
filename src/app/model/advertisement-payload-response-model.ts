import {AvailabilityPayloadModel} from "./availability-payload-model";
import {UserPayloadModel} from "./user-payload-model";

export class AdvertisementPayloadResponseModel {
  constructor(public id : number,
              public userPayload : UserPayloadModel,
              public subjectName : string,
              public price : number,
              public minutesDuration : number,
              public placesNames : string[],
              public cityName : string,
              public shortDescription : string,
              public content : string,
              public availabilityPayloads : AvailabilityPayloadModel[],
              public lessonRanges : string[],
              public advertisementType : string,
              public reviewsQuantity : number,
              public ratingAverage : number) {
  }
}
