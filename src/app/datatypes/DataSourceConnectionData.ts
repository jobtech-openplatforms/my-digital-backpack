import { DataSourceType } from './DataSourceType';
import { ItemBase } from './ItemBase';

export class DataSourceConnectionData<T1, T2> extends ItemBase {
    sourceId = '';
    userId = '';
    dataType = DataSourceType.GigPlatform;
    connectionType: 'Live' | 'ManuallyUpdated' | 'UserCreated' = 'ManuallyUpdated';
    connectionState:
        'Loading' | 'AwaitingOAuthAuthentication' | 'AwaitingEmailVerification'
        | 'Manual' | 'Connected' | 'Synced' | 'Removed' = 'Manual';
    lastSyncTime = 0;
    isValidated = false;
    displaySettings?: T2;
    aggregatedData?: T1;
}
