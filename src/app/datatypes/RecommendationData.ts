import { RatingData } from './RatingData';
import { CVDataType } from './CVDataType';
import { ItemBase } from './ItemBase';
export class RecommendationData extends ItemBase {
    relatedDataType: CVDataType = CVDataType.PositionsData;
    relatedData = ''; // id of related data
    recommender = ''; // Individual-id
    summary = '';
    rating?: RatingData;
}
