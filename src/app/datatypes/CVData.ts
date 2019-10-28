import { ProfileData } from './ProfileData';
import { CVCategoryCollection } from './CVCategoryCollection';
export class CVData {
    dataVersion = 1;
    profile: ProfileData = new ProfileData(); // our own data object
    categories: CVCategoryCollection[] = [];
}
