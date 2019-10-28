import { Utility } from '../utils/Utility';
import { OrganizationData } from './OrganizationData';
import { DegreeType } from './DegreeType';
import { ItemBase } from './ItemBase';
export class EducationData extends ItemBase {
    organization: OrganizationData = new OrganizationData();
    fieldOfStudy = '';
    startDate: string = Utility.formatDate(new Date());
    endDate: string = Utility.formatDate(new Date());
    isOngoing = false;
    degree: DegreeType = DegreeType.None;
    activities = ''; // unknown what this is supposed to be
    summary = '';
}
