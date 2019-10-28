import { Utility } from '../utils/Utility';
import { IndividualData } from './IndividualData';
import { OrganizationData } from './OrganizationData';
import { ItemBase } from './ItemBase';
export class PublicationData extends ItemBase {
    title = '';
    publisher: OrganizationData = new OrganizationData();
    authors: IndividualData[] = [];
    date: string = Utility.formatDate(Date.now());
    url = '';
    summary = '';
}
