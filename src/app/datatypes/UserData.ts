import { ItemBase } from './ItemBase';
export class UserData extends ItemBase {
    name = '';
    id = '';
    dataVersion = 1;
    photo = '';
    email = '';
    myCvDataUser = '';
    documents: string[] = [];
    settings = {
        createdProfile: false
    };
}
