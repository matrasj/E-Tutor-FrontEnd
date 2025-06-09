import {AdvertisementPayloadLightModel} from "../advertisement/advertisement-payload-light-model";

export interface VisitPayloadModel {
  id: number;
  visitContent: string;
  visitDate: string;
  visitTime: string;
  advertisement: AdvertisementPayloadLightModel;
  authorId: number;
  accepted: boolean;
}
