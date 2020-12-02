'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
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
exports.DateTime = DateTime;
Object.freeze(DateTime);
//# sourceMappingURL=DateTime.js.map