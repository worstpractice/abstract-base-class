`use strict`;
const { ABC } = require('../abc.js');

class IAnimal extends ABC {

  constructor() {
    super();
  }
  foo() {}

  [Symbol]() {
    console.log(`indeed`);
  }
}

Object.freeze(IAnimal); // Non-mandatory, unproven 'best practice' for abstract interfaces of all shapes & sizes

module.exports = { IAnimal };
