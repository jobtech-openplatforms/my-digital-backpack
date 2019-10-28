import { Utility } from '../utils/Utility';
import { OrganizationData } from './OrganizationData';
import { ItemBase } from './ItemBase';
export class CourseData extends ItemBase {
    name = '';
    organization: OrganizationData = new OrganizationData();
    startDate: string = Utility.formatDate(new Date());
    endDate: string = Utility.formatDate(new Date());
    score = 0; // added
}

