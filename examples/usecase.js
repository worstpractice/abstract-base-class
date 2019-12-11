`use strict`;
const { Dog } = require('./dog.js');
const { Shiba } = require('./shiba.js');

const dog = new Dog();

const shiba = new Shiba();

console.log(dog.bark());

console.log(shiba.want());
