import { Utility } from '../utils/Utility';
import { LinkData } from './LinkData';
import { LocationData } from './LocationData';
export class ProfileData {
    dataVersion = 1;
    name = '';
    photo = '';
    title = '';
    birthdate = '';
    location: LocationData = new LocationData();
    summary = '';
    interests = ''; // moved from top level
    associations = ''; // moved from top level
    links: LinkData[] = [];
}

