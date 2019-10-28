import { Utility } from '../utils/Utility';
import { IndividualData } from './IndividualData';
import { OrganizationData } from './OrganizationData';
import { PatentStatus } from './PatentStatus';
import { ItemBase } from './ItemBase';
export class PatentData extends ItemBase {
    title = '';
    summary = '';
    number = 0;
    patentStatus: PatentStatus = PatentStatus.Application;
    office: OrganizationData = new OrganizationData();
    inventors: IndividualData[] = [];
    date: string = Utility.formatDate(Date.now());
    url = '';
}
