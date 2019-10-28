import { CVData } from './CVData';
export class DocumentData {
    id = '';
    dataVersion = 1;
    created = 0;
    changed = 0;
    userId = '';
    owners: string[] = [];
    name = '';
    isPublic = true;
    data: CVData = new CVData();
}
