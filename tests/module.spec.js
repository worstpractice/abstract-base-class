`use strict`;
const abcModule = require('../abc.js');


describe(`the module 'abc.js'`, () => {

  describe(`when imported`, () => {

    it(`should exist`, () => {
      expect(abcModule).toBeDefined();
    });

    it(`should be an object`, () => {
      expect(abcModule).toBeInstanceOf(Object);
    });

    it(`should provide the named export 'ABC'`, () => {
      expect(abcModule).toMatchObject({
        'ABC': expect.any(Function)},
      );
    });

    it(`should be frozen`, () => {
      expect(abcModule).toBeFrozen();
    });
  
    describe(`the named export 'ABC'`, () => {

      it(`should exist`, () => {
        expect(abcModule.ABC).toBeDefined();
      });

      it(`should be a function`, () => {
        expect(abcModule.ABC).toBeInstanceOf(Function);
      });

      it(`should not be directly callable`, () => {
        expect(() => {
          abcModule.ABC();
        }).toThrowError(TypeError);
      });

      it(`should be frozen`, () => {
        expect(abcModule.ABC).toBeFrozen();
      });
    });
  });
});
