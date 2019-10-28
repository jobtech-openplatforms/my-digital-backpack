import { ReviewData } from './ReviewData';
import { CertificationData } from './CertificationData';
export class ServerUserResources {
    reviews: {
        [prop: string]: ReviewData;
    } = {};
    certificates: {
        [prop: string]: CertificationData;
    } = {};
}
