`use strict`;
const { ABC } = require('./../../abc.js');
const { IAnimal } = require('./../../examples/ianimal.js');
const { Dog } = require('./../../examples/dog.js');


describe(`the concrete implementation 'Dog'`, () => {

  describe(`when examined prototypically`, () => {

    it(`should be a direct subclass of 'IAnimal'`, () => {
      expect(Object.getPrototypeOf(Dog)).toBe(IAnimal);
    });

    it(`should be an indirect subclass of 'ABC'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Dog))).toBe(ABC);
    });

    it(`should not be an indirect subclass of 'IAnimal'`, () => {
      expect(Object.getPrototypeOf(Object.getPrototypeOf(Dog))).not.toBe(IAnimal);
    });

    it(`should not be a direct subclass of 'ABC'`, () => {
      expect(Object.getPrototypeOf(Dog)).not.toBe(ABC);
    });
  });

  describe(`when instantiated directly`, () => {

    it(`should be concrete`, () => {
      expect(() => {
        new Dog();
      }).not.toThrow();
    });

    it(`should be descended from 'ABC'`, () => {
      expect(new Dog()).toBeInstanceOf(ABC);
    });
  
    it(`should be descended from 'IAnimal'`, () => {
      expect(new Dog()).toBeInstanceOf(IAnimal);
    });
  });

  describe(`when instantiated indirectly`, () => {

    it(`should throw a TypeError`, () => {
      expect(() => {
        new Dog.constructor();
      }).toThrowError(TypeError);  // TODO: This error message should really be the INTERFACE cannot-new message
    });
  });
});
