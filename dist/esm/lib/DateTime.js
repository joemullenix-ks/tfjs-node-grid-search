'use strict';
//DOOM: TEMP! Testing npm namespaces
class DateTime {
    constructor() {
        this._data = '';
        console.warn('THIS IS A TEMP DOOMED CLASS');
    }
    get data() { return this._data; }
    set data(data) {
        console.assert(data !== '');
        this._data = data;
    }
}
Object.freeze(DateTime);
export { DateTime };
//# sourceMappingURL=DateTime.js.map