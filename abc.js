`use strict`;
// TODO: handle interface symbols as well, using Object.getOwnSymbols/Reflect.ownKeys yadda yadda
//       All we gotta do is inspect WHAT the interface defines as custom & then enforce that when inspecting 'this'

// TODO: add a Map for memoization. ABC does not know about any inheritors until they are instantiated -- so in a sense, they already 'register' their
//       presence with ABC (upon their instantiation). We need only conclude that functionality with an actual lookup table for future instantiations.
//
//       BEFORE: O(n) instantiation cost.
//       AFTER: O(1) instantiation cost.
//
//       For example: perform all the costly checks on their class' constructor ONCE, store the outcome of that check in the map (keyed to said
//       constructor object), and upon each new instantiation, query the map for the new object's constructor. And/or compare for identity.
//       Or something like this.

// TODO: memoize the prototype chain ('family tree') of each examined object as well.
//       So we don't have to instantiate an array, (re)walk an object graph of unknown depth, stopping to store into the array, every single time.

// TODO: Instead of caching manually, request a global Symbol for the class constructor of the new object! (Is the global symbol store slow?)

// TODO: Instead of asking if something is an instance of ABC, always use Symbol.for(ABC)?

// TODO: If the interface defines an iterator (using [Symbol.iterator]), the children must implement that as well.

// TODO: monkey with Symbol.species -- alternative to Proxy.construct() (and/or Symbol.isInstance)

// TODO: explore Reflect.construct(), especially in unison with Symbol.species

// TODO: swap Object.getOwnPropertyNames for Reflect.ownKeys()? (includes symbols), or a separate Object.getOwnSymbols check (empty if no custom)

// TODO: compare the length property of the methods to determine how many arguments are expected by the abstract interface! Woop woop

const prototypeTable = new WeakMap();

class ABC {

  constructor() {
    // one does not simply instantiate an ABC directly
    if (Object.is(ABC, this.constructor)) {
      const message = `The Abstract Base Class (ABC) cannot be instantiated directly.`
      throw new TypeError(message);
    }

    // instantiate the IMPLEMENTERS OF your abstract interface -- never the abstract interface ITSELF!
    if (Object.is(ABC, Object.getPrototypeOf(this.constructor))) {
      prototypeTable.set([Symbol.for(this.constructor), false]);
      const message = `Abstract Interfaces cannot be instantiated directly. Instead, have other ('concrete') classes inherit from them, implementing their abstract methods.`
      throw new TypeError(message);
    }

    // a blank map, for us to draw (as we go)
    const prototypeChain = [];

    // tomfoolery allowing for convenient function-local recursion
    let that = this;

    // while we've not yet walked the entire prototype chain...
    while (!Object.is(ABC, that.constructor)) {
      // ...walk another prototype's worth...
      that = Object.getPrototypeOf(that);
      // ...jotting down the path as we go
      prototypeChain.push(that);
    }

    // there must be ATLEAST three links on the chain by now (ABC <- Abstract Interface <- Concrete Implementation(s)...) 
    if (prototypeChain.length < 3) {
      const message = `UNDEFINED BEHAVIOR: How did we get here if there are no implementors!?`;
      throw new TypeError(message);
    }

    // and then there were (atleast) three...

    // popping off the very last link of the chain (which should ALWAYS be ABC itself)
    const lastLink = prototypeChain.pop();
    if (!Object.is(ABC, lastLink.constructor)) {
      const message = `UNDEFINED BEHAVIOR: The last link in the prototypeChain array should ALWAYS be ABC itself!`;
      throw new TypeError(message);
    }

    // ...and then there were (atleast) two...

    // popping off the next piece -- what should be the abstract interface (read: class inheriting from ABC directly)
    const abstractInterface = prototypeChain.pop();
    if (!Object.is(ABC, Object.getPrototypeOf(abstractInterface).constructor)) {
      const message = `UNDEFINED BEHAVIOR: The second-to-last link in the prototypeChain array should ALWAYS be a DIRECT descendant of ABC!`;
      throw new TypeError(message);
    }

    // ...and then there were (atleast) one.

    // whatever now remains in the prototypeChain array should be the concrete class(es) implementing the abstract interface
    if (prototypeChain.length < 1) {
      const message = `UNDEFINED BEHAVIOR: How did we get here if there are no implementors!?`;
      throw new TypeError(message);
    }

    // save the methods defined on the abstract interface (sans 'constructor') for later comparison to each implementer's methods
    const abstractMethods = Object.getOwnPropertyNames(abstractInterface).filter((key) => key !== 'constructor');

    // also: if the interface defines any static methods at all, we're interested in them (sans 'length', 'prototype' and 'name')...
    const abstractStaticMethods = Object.getOwnPropertyNames(abstractInterface.constructor).filter((key) => key !== 'length' && key !== 'prototype' && key !== 'name');

    // for each implementer of the interface...
    for (const implementer of prototypeChain) {

      // we store all of its methods (sans 'constructor')
      const concreteMethods = Object.getOwnPropertyNames(implementer).filter((key) => key !== 'constructor');

      // as well as any static methods (sans 'length', 'prototype' and 'name')
      const concreteStaticMethods = Object.getOwnPropertyNames(implementer.constructor).filter((key) => key !== 'length' && key !== 'prototype' && key !== 'name');

      // for each static method defined on the abstract interface...
      for (const staticMethod of abstractStaticMethods) {

        // if the implementer is MISSING said static abstract interface method... KA-BOOM
        if (!concreteStaticMethods.includes(staticMethod)) {
          const message = `Class '${implementer.constructor.name}' must implement the '${staticMethod}' method as static to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }
      }

      // for each method defined on the abstract interface...
      for (const method of abstractMethods) {

        // if the implementer is MISSING said abstract interface method... KA-BOOM
        if (!concreteMethods.includes(method)) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // if it's not missing, but the abstract interface and concrete implementer differ in the async quality of the methods being compared...
        if (!(Object.is(abstractInterface[method].constructor, implementer[method].constructor))) {

          // if the abstract interface defined an async method...
          if (Object.is(abstractInterface[method].constructor, (async function(){}).constructor)) {
            const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as async to fulfill the '${abstractInterface.constructor.name}' interface.`;
            throw new TypeError(message);
          }

          // else -- meaning, if the abstract interface defined a regular ('synchronous') method...
          else {
            const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as non-async to fulfill the '${abstractInterface.constructor.name}' interface.`;
            throw new TypeError(message);
          }
        }

        // property descriptor comparisons begin here...

        // we retrieve the corresponding descriptor for the current method (from each object, respectively)
        const abstractDescriptor = Object.getOwnPropertyDescriptor(abstractInterface, method);
        const concreteDescriptor = Object.getOwnPropertyDescriptor(implementer, method);

        // if the interface defines a 'regular' (non-accessor) method which the implementer does not... KA-BOOM
        if (abstractDescriptor.value && !concreteDescriptor.value) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // if the interface defines a getter method which the implementer does not... KA-BOOM
        if (abstractDescriptor.get && !concreteDescriptor.get) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as a getter to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // if the interface defines a setter method which the implementer does not... KA-BOOM
        if (abstractDescriptor.set && !concreteDescriptor.set) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as a setter to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }
      }
    }
  prototypeTable.set([Symbol.for(this.constructor), true]);  // last thing, add it as GOOD
  }
}

// const GUID = Symbol.for(ABC);

// console.log(Object.is(Symbol.for(ABC), Symbol.for(Symbol.keyFor(Symbol.for(ABC)))));

// Barring 'new ABC.constructor()' shenanigans by overwriting ABC's own constructor with a proxied version of itself
ABC.constructor = Object.freeze(new Proxy(ABC.constructor, Object.freeze({
  construct() {
    //
    //
    // if (prototypeTable.get(Symbol.for(this.constructor)) === false) throw new TypeError(`NUH-UH!`);
    //
    //
    // Here we can reflect onto the caller and produce a more fitting error message
    const message = `An Abstract Base Class (ABC) cannot be instantiated indirectly, either.`;
    throw new TypeError(message);
  },
})));

prototypeTable.set([Symbol.for(ABC), false]);

module.exports = { ABC: Object.freeze(ABC) };

Object.freeze(module.exports);
