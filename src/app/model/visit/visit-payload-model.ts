import {AdvertisementPayloadLightModel} from "../advertisement/advertisement-payload-light-model";

export interface VisitPayloadModel {
  id: number;
  purpose: string;
  visitDate: string;
  visitTime: string;
  advertisement: AdvertisementPayloadLightModel;
  advertisementId: number;
  authorId: number;
  accepted: boolean;
  rejected: boolean;
  requesterName: string;
  tutorName: string;
}
