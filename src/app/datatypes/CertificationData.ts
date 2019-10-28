import { Utility } from '../utils/Utility';
import { OrganizationData } from './OrganizationData';
import { ItemBase } from './ItemBase';

export class CertificationData extends ItemBase {
    organization: OrganizationData = new OrganizationData();
    date: string = Utility.formatDate(new Date());
    type = ''; // TODO: change to list of types
    title = '';
    summary = '';
    scoreValue = 0; // added
    scoreLabel = ''; // added
    image = '';
}

