import { Utility } from '../utils/Utility';
import { OrganizationData } from './OrganizationData';
import { RatingData } from './RatingData';
import { ItemBase } from './ItemBase';
export class GigPlatformData extends ItemBase {
    noOfGigs = 0;
    noOfRatings = 0;
    averageRating: RatingData = new RatingData();
    percentageSuccessful = 0;
    alternativeRatings?: {
        name: string;
        averageRating: RatingData;
    }[] = [];
    startDate: string = Utility.formatDate(new Date());
    endDate: string = Utility.formatDate(new Date());
    organization = new OrganizationData();
}
