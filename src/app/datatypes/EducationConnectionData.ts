import { DataSourceConnectionData } from './DataSourceConnectionData';
import { DisplaySettingsBase } from './DisplaySettingsBase';
import { EducationData } from './EducationData';
export class EducationConnectionData extends DataSourceConnectionData<EducationData, DisplaySettingsBase> {
    constructor() {
        super();
        this.displaySettings = new DisplaySettingsBase();
        this.aggregatedData = new EducationData();
    }
}

