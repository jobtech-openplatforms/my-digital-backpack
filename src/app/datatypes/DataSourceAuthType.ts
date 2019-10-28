import { DataSourceType } from './DataSourceType';
export class DataSourceAuthType {
    static EmailValidation = <DataSourceType><any>'EmailValidation';
    static OAuthLogin = <DataSourceType><any>'OAuthLogin';
    static None = <DataSourceType><any>'None';
}
