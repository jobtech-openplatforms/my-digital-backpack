import { Utility } from '../utils/Utility';
import { OrganizationData } from './OrganizationData';
import { ItemBase } from './ItemBase';
export class PositionData extends ItemBase {
    title = '';
    summary = '';
    startDate: string = Utility.formatDate(new Date());
    endDate: string = Utility.formatDate(new Date());
    isOngoing = false;
    isCurrent = false;
    organization: OrganizationData = new OrganizationData();
}

