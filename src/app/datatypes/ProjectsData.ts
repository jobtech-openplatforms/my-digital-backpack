import { Utility } from '../utils/Utility';
import { ItemBase } from './ItemBase';
import { ImageData } from './ImageData';
export class ProjectsData extends ItemBase {
    title = '';
    summary = '';
    images: ImageData[] = [];
    completionDate: string = Utility.formatDate(new Date());
}
