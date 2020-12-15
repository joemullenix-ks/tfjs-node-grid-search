/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
import { ModelStatics } from '../src/lib/ModelStatics';
test('instantiation; readonlys', () => {
    //TEMP: satisfy the builder (this is up next)
    const tempinst = new ModelStatics({});
    expect(tempinst).toBeInstanceOf(ModelStatics);
});
//# sourceMappingURL=ModelStatics.test.js.map