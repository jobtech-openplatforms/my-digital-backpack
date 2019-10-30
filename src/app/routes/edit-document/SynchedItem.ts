import { Observable } from 'rxjs';
import { Utility } from '../../../../src/app/utils/Utility';
import { ItemBase } from '../../../../src/app/datatypes/ItemBase';

export class SynchedItem {
    public static cache: { [id: string]: SynchedItem } = {};

    private sub;
    constructor(public id: string, private itemObservable: Observable<any>, public targetObj: ItemBase) {
        this.sub = this.itemObservable.subscribe((updatedData) => {
            // console.log('updated data item recieved:', updatedData);
            if (updatedData) {
                Utility.replaceObject(this.targetObj, updatedData);
            }
        });
        SynchedItem.cache[this.id] = this;
    }
    dispose() {
        this.sub.unsubscribe();
        delete SynchedItem.cache[this.id];
    }
}
