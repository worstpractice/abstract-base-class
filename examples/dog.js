`use strict`;
const { IAnimal } = require('./ianimal.js');

class Dog extends IAnimal {

  constructor() {
    super();
  }
  foo() {}

  [Symbol]() {
    console.log(`not really`);
  }
}

new Dog();

module.exports = { Dog };
