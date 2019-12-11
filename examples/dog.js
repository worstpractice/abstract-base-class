`use strict`;
const { IAnimal } = require('./ianimal.js');

class Dog extends IAnimal {

  constructor() {
    super();
  }

  eat(item=`dogfood`) {
    return `${this.constructor.name} ate some ${item}!`;
  }

  sleep(minutes=20) {
    return `${this.constructor.name} slept for ${duration} minute${duration === 1 ? `` : `s`}!`;
  }

  bark() {
    return `${this.constructor.name} barked!`;
  }
}

module.exports = { Dog };
