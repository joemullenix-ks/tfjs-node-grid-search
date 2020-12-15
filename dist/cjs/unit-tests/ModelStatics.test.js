/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const ModelStatics_1 = require("../src/lib/ModelStatics");
test('instantiation; readonlys', () => {
    //TEMP: satisfy the builder (this is up next)
    const tempinst = new ModelStatics_1.ModelStatics({});
    expect(tempinst).toBeInstanceOf(ModelStatics_1.ModelStatics);
});
//# sourceMappingURL=ModelStatics.test.js.map