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

  describe(`when instantiated indirectly ('bamboozled')`, () => {

    it(`should still be abstract`, () => {
      expect(() => {
        new IAnimal.constructor();
      }).toThrowError(TypeError);
    });
  });
});

    // // we expect ABC to figure in the prototype chain of 'this'
    // if (!(this instanceof ABC)) {
    //   const message = `UNDEFINED BEHAVIOR: How could this be?`
    //   throw new TypeError(message);
    // }