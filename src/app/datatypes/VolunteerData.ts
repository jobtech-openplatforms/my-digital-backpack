import { OrganizationData } from './OrganizationData';
import { ItemBase } from './ItemBase';
export class VolunteerData extends ItemBase {
    organization: OrganizationData = new OrganizationData();
    role = '';
    cause = '';
    opportunities = '';
}
