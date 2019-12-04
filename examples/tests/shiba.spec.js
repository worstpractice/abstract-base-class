`use strict`;
const { ABC } = require('./../../abc.js');
const { IAnimal } = require('./../../examples/ianimal.js');
const { Dog } = require('./../../examples/dog.js');
const { Shiba } = require('./../../examples/shiba.js');


describe(`the implementation 'Shiba'`, () => {

  describe(`when examined prototypically`, () => {

    it(`should be a direct subclass of 'Dog'`, () => {
      expect(Object.getPrototypeOf(Shiba)).toBe(Dog);
    });

    it(`should be an indirect subclass of 'IAnimal'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Shiba))).toBe(IAnimal);
    });

    it(`should be an indirect subclass of 'ABC'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Shiba)))).toBe(ABC);
    });

    it(`should not be an indirect subclass of 'Dog'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Shiba))).not.toBe(Dog);
    });

    it(`should not be a direct subclass of 'IAnimal'`, () => {
      expect(Object.getPrototypeOf(Shiba)).not.toBe(IAnimal);
    });

    it(`should not be a direct subclass of 'ABC'`, () => {
      expect(Object.getPrototypeOf(Shiba)).not.toBe(ABC);
    });
  });

  describe(`when instantiated directly`, () => {

    it(`should be concrete`, () => {
      expect(() => {
        new Shiba();
      }).not.toThrow();
    });
  });

  describe(`when instantiated indirectly ('bamboozled')`, () => {

    it(`should throw a TypeError`, () => {
      expect(() => {
        new Shiba.constructor();
      }).toThrowError(TypeError);  // This should actually WORK probably, since Dog is concrete
    });
  });
});
