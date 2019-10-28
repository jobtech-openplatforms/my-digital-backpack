import { Utility } from '../utils/Utility';
import { IndividualData } from './IndividualData';
import { OrganizationData } from './OrganizationData';
import { RatingData } from './RatingData';
import { ItemBase } from './ItemBase';
export class ReviewData extends ItemBase {
    reviewer = new IndividualData();
    organization = new OrganizationData();
    summary = '';
    rating = new RatingData();
    date: string = Utility.formatDate(new Date());
}
