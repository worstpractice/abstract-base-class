`use strict`;
const { ABC } = require('./../../abc.js');
const { IAnimal } = require('./../../examples/ianimal.js');


describe(`the example abstract interface 'IAnimal'`, () => {

  describe(`when examined prototypically`, () => {

    it(`should be a direct subclass 'ABC'`, () => {
      expect(Object.getPrototypeOf(IAnimal)).toBe(ABC);
    });

    it(`should not be an indirect subclass of 'ABC'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(IAnimal))).not.toBe(ABC);
    });
  });

  describe(`when instantiated directly`, () => {

    it(`should be abstract`, () => {
      expect(() => {
        new IAnimal();
      }).toThrowError(TypeError);
    });
  });

  describe(`when instantiated indirectly`, () => {

    it(`should still be abstract`, () => {
      expect(() => {
        new IAnimal.constructor();
      }).toThrowError(TypeError);
    });
  });
});
