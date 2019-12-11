`use strict`;
const { ABC } = require('../abc.js');

class IAnimal extends ABC {

  constructor() {
    super();
  }
  
  eat(item=`food`) {
    return `${this.constructor.name} ate some ${item}!`;
  }

  sleep(minutes=30) {
    return `${this.constructor.name} slept for ${duration} minute${duration === 1 ? `` : `s`}!`;
  }
}

Object.freeze(IAnimal); // Non-mandatory, unproven 'best practice' for abstract interfaces of all shapes & sizes

module.exports = { IAnimal };
