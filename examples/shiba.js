`use strict`;
const { Dog } = require('./dog.js');

class Shiba extends Dog {

  constructor() {
    super();
  }
  foo() {}

  [Symbol]() {
    console.log(`oh you`);
  }

  three(a, b, c) {}

  two(a, b) {}
}

module.exports = { Shiba };
