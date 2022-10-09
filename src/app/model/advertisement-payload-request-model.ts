import {AvailabilityPayloadRequestModel} from "./availability-payload-request-model";

export class AdvertisementPayloadRequestModel {
  constructor(public subjectName : string,
              public price : number,
              public minutesDuration : number,
              public placesNames : string[],
              public shortDescription : string,
              public content : string,
              public availabilityPayloads : AvailabilityPayloadRequestModel[],
              public lessonRanges : string[],
              public advertisementType : string) {
  }
}
