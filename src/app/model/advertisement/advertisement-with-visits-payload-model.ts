import {AdvertisementPayloadLightModel} from "./advertisement-payload-light-model";
import {VisitPayloadModel} from "../visit/visit-payload-model";

export interface AdvertisementWithVisitsPayloadModel {
  advertisement: AdvertisementPayloadLightModel;
  visits: VisitPayloadModel[];
}
