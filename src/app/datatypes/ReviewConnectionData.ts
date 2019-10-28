import { DataSourceConnectionData } from './DataSourceConnectionData';
import { ReviewData } from './ReviewData';
import { DisplaySettingsBase } from './DisplaySettingsBase';
export class ReviewConnectionData extends DataSourceConnectionData<ReviewData, DisplaySettingsBase> {
    constructor() {
        super();
        this.displaySettings = new DisplaySettingsBase();
        this.aggregatedData = new ReviewData();
    }
}

