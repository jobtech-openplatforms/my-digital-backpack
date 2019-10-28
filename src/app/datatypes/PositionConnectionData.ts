import { DataSourceConnectionData } from './DataSourceConnectionData';
import { PositionData } from './PositionData';
import { DisplaySettingsBase } from './DisplaySettingsBase';
export class PositionConnectionData extends DataSourceConnectionData<PositionData, DisplaySettingsBase> {
    constructor() {
        super();
        this.displaySettings = new DisplaySettingsBase();
        this.aggregatedData = new PositionData();
    }
}

