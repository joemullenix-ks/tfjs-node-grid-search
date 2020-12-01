'use strict';
//TEMP
class DateTime {
    constructor() {
        this._data = '';
        // Lint gripes about empty constructors. Apperently this is good enough. Party on.
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