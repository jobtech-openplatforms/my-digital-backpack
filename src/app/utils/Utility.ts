export class Utility {
    public static cloneFireBaseObject(data: { [prop: string]: any }) {
        const saveData: { [prop: string]: any } = {};
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (
                    prop === '$key'
                    || prop === '$exists'
                    || prop === '$value'
                ) {
                    continue;
                }
                saveData[prop] = data[prop];
            }
        }
        return saveData;
    }

    public static cloneObject(data: object) {
        return JSON.parse(JSON.stringify(data));
    }

    public static copyPropsFromFireBaseObj(data: any, newData: any, keepKey = false) {
        for (const prop in newData) {
            if (newData.hasOwnProperty(prop)) {
                if (
                    prop === '$key' && keepKey === false
                    || prop === '$exists'
                    || prop === '$value'
                ) {
                    continue;
                }
                data[prop] = newData[prop];
            }
        }
        for (const prop2 in data) { // replace empty arrays (removed by firebase)
            if (data[prop2] instanceof Array) {
                if (!newData[prop2]) {
                    console.log('removed empty array: ', prop2);
                    data[prop2] = [];
                }
            }
        }
        return data;
    }


    public static detectChangedFields(a: any, b: any): Array<string> {
        const changedFields = [];
        for (const prop in a) {
            if (a.hasOwnProperty(prop)) {
                if (
                    prop === '$key'
                    || prop === '$exists'
                    || prop === '$value'
                ) {
                    continue;
                }
                if ((b[prop] == null) || a[prop].toString() !== b[prop].toString()) {
                    if (b[prop] == null && a[prop].toString() === '') { // special test since empty arrays are null in firebase

                    } else {
                        changedFields.push(prop);
                    }
                }
            }
        }
        return changedFields;
    }

    public static objectToArray(data: any): Array<any> {
        const out = [];
        for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
                out.push(data[prop]);
            }
        }
        return out;
    }

    public static replaceObject(target: any, source: any, deep = false) {
        for (const prop in source) {
            if (source.hasOwnProperty(prop)) {
                if (deep && typeof target[prop] === 'object' && target[prop] !== null) {
                    target[prop] = Utility.replaceObject(target[prop], source[prop], deep);
                } else {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    public static formatDate(date: number | string | Date) {
        const d = new Date(date);
        const year = d.getFullYear();
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    public static validateEmail(email: string) {
        // tslint:disable-next-line:max-line-length
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }
}
