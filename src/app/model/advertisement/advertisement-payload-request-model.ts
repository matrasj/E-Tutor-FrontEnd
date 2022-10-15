import {AvailabilityPayloadModel} from "./availability-payload-model";

export class AdvertisementPayloadRequestModel {
  constructor(public authorId : number,
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
              public authorImageLink : string) {
  }
}
