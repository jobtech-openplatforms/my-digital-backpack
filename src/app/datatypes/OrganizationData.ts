import { OrganizationType } from './OrganizationType';
export class OrganizationData {
    id = '';
    dataVersion = 1;
    name = '';
    description = '';
    country = 'Sweden';
    type: OrganizationType = OrganizationType.PrivateCompany;
    logo = '';
    industry = 0; // https://developer.linkedin.com/docs/reference/industry-codes
    ticker = '';
}
