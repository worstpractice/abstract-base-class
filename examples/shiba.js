`use strict`;
const { Dog } = require('./dog.js');

class Shiba extends Dog {

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

  want(foodItem=`people food`) {
    return `${this.constructor.name} gazes longingly at ${foodItem}!`;
  }
}

module.exports = { Shiba };
