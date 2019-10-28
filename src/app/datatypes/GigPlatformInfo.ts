import { OrganizationData } from './OrganizationData';
import { DataSourceAuthType } from './DataSourceAuthType';
import { DataSourceType } from './DataSourceType';
export class GigPlatformInfo {
    id = '';
    organization: OrganizationData = new OrganizationData();
    dataType: DataSourceType = DataSourceType.GigPlatform;
    authType: DataSourceAuthType = DataSourceAuthType.EmailValidation;
    connectionType: 'Live' | 'ManuallyUpdated' | 'UserCreated' = 'ManuallyUpdated';
    externalPlatformId: string;
}


