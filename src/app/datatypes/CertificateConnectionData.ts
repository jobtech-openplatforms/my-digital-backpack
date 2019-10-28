import { DataSourceConnectionData } from './DataSourceConnectionData';
import { DisplaySettingsBase } from './DisplaySettingsBase';
import { CertificationData } from './CertificationData';
export class CertificateConnectionData extends DataSourceConnectionData<CertificationData, DisplaySettingsBase> {
    constructor() {
        super();
        this.displaySettings = new DisplaySettingsBase();
        this.aggregatedData = new CertificationData();
    }
}
