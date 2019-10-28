import { LanguageProficiency } from './LanguageProficiency';
import { ItemBase } from './ItemBase';
export class LanguageData extends ItemBase {
    language = '';
    proficiency: LanguageProficiency = LanguageProficiency.nativeOrBilingual;
}
