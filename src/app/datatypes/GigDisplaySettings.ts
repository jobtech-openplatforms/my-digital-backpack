import { Utility } from '../utils/Utility';
export class GigDisplaySettings {
    displayType: 'AverageRating' | 'PercentageSuccessful' | 'NoOfInteractions' = 'NoOfInteractions';
    displayRange: 'AllTime' | 'LastYear' | 'LastHalfyear' | 'LastThreeMonths' = 'AllTime';
    displayUpdatedAt: string = Utility.formatDate(new Date());
}

