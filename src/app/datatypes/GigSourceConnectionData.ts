import { DataSourceConnectionData } from './DataSourceConnectionData';
import { GigPlatformData } from './GigPlatformData';
import { GigDisplaySettings } from './GigDisplaySettings';
export class GigSourceConnectionData extends DataSourceConnectionData<GigPlatformData, GigDisplaySettings> {
    constructor() {
        super();
        this.displaySettings = new GigDisplaySettings();
        this.aggregatedData = new GigPlatformData();
    }
}

