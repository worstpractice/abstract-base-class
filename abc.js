`use strict`;
// TODO: Handle the interfaces' SYMBOLS as well (using Object.getOwnSymbols or Reflect.ownKeys)
//       All we have to do is inspect the interface for the invariant it defines & then enforce that invariant when inspecting 'this' (each instantiation)
//
// TODO: Add a weakmap for memoization. ABC does not know about any inheritors until they are instantiated -- so in a sense, they already 'register' their
//       presence with ABC (upon their instantiation). We need only conclude that functionality with an actual lookup table for future instantiations.
//
//       BEFORE: O(n) instantiation cost?
//       AFTER: O(1) instantiation cost?
//
//       For example: perform all the costly checks on their class' constructor ONCE, store the outcome of that check in the weakmap -- a boolean 'true'
//                    or perhaps a symbol -- (keyed to said constructor object), and upon each new instantiation, query the map using the new object's
//                    constructor.
//
// TODO: Memoize the prototype chain ('family tree') of each examined object as well?
//       So we don't have to instantiate an array, (re)walk an object graph of unknown depth, stopping to store into the array, every single time.
//
// TODO: Instead of caching manually, request a global Symbol for the class constructor of the new object! (Works cross-realm as well).
//
// TODO: Instead of asking if something is an instance of ABC, always use Symbol.for(ABC)?
//
// TODO: If the interface defines an iterator (using [Symbol.iterator]), the children must implement that as well.
//
// TODO: Explore Symbol.species as an alternative to Proxy.construct() (and/or Symbol.isInstance).
//
// TODO: Explore Reflect.construct(), especially in unison with Symbol.species.
//
// TODO: Swap Object.getOwnPropertyNames for Reflect.ownKeys()? (includes symbols), or a separate Object.getOwnSymbols check.
//
// TODO: Compare the length property of the methods to determine how many arguments are expected by the abstract interface.
//
// TODO: Loop detection in prototype chain? (Highly unlikely that prototype chain wouldn't be inherently acyclic already)
//


const prototypeTable = new WeakMap();

class ABC {

  constructor() {
    // One does not simply instantiate an ABC directly
    if (Object.is(ABC, this.constructor)) {
      const message = `The Abstract Base Class (ABC) cannot be instantiated directly.`
      throw new TypeError(message);
    }

    // Instantiate the IMPLEMENTERS OF your abstract interface -- never the abstract interface ITSELF!
    if (Object.is(ABC, Object.getPrototypeOf(this.constructor))) {
      prototypeTable.set([Symbol.for(this.constructor), false]);
      const message = `Abstract Interfaces cannot be instantiated directly. Instead, have other ('concrete') classes inherit from them, implementing their abstract methods.`
      throw new TypeError(message);
    }

    // A blank map, for us to draw (as we go).
    const prototypeChain = [];

    // Tomfoolery allowing for convenient function-local recursion.
    let that = this;

    // While we've not yet walked the entire prototype chain...
    while (!Object.is(ABC, that.constructor)) {
      // ...walk another prototype's worth...
      that = Object.getPrototypeOf(that);
      // ...jotting down the path as we go.
      prototypeChain.push(that);
    }

    // There must be ATLEAST three links on the chain by now (ABC <- Abstract Interface <- Concrete Implementation(s)).
    if (prototypeChain.length < 3) {
      const message = `UNDEFINED BEHAVIOR: How did we get here if there are no implementors!?`;
      throw new TypeError(message);
    }

    // and then there were (atleast) three...

    // Popping off the very last link of the chain (which should ALWAYS be ABC itself).
    const lastLink = prototypeChain.pop();
    if (!Object.is(ABC, lastLink.constructor)) {
      const message = `UNDEFINED BEHAVIOR: The last link in the prototypeChain array should ALWAYS be ABC itself!`;
      throw new TypeError(message);
    }

    // ...and then there were (atleast) two...

    // Popping off the next piece -- what should be the abstract interface (read: class inheriting from ABC directly).
    const abstractInterface = prototypeChain.pop();
    if (!Object.is(ABC, Object.getPrototypeOf(abstractInterface).constructor)) {
      const message = `UNDEFINED BEHAVIOR: The second-to-last link in the prototypeChain array should ALWAYS be a DIRECT descendant of ABC!`;
      throw new TypeError(message);
    }

    // ...and then there were (atleast) one.

    // Whatever now remains in the prototypeChain array should be the concrete class(es) implementing the abstract interface.
    if (prototypeChain.length < 1) {
      const message = `UNDEFINED BEHAVIOR: How did we get here if there are no implementors!?`;
      throw new TypeError(message);
    }

    // Save the methods defined on the abstract interface (sans 'constructor') for later comparison to each implementer's methods.
    const abstractMethods = Object.getOwnPropertyNames(abstractInterface).filter((key) => key !== 'constructor');

    // Also: if the interface defines any static methods at all, we're interested in them (sans 'length', 'prototype' and 'name').
    const abstractStaticMethods = Object.getOwnPropertyNames(abstractInterface.constructor).filter((key) => key !== 'length' && key !== 'prototype' && key !== 'name');

    // For each implementer of the interface...
    for (const implementer of prototypeChain) {

      // ...we store all of its methods (sans 'constructor')...
      const concreteMethods = Object.getOwnPropertyNames(implementer).filter((key) => key !== 'constructor');

      // ...as well as any static methods (sans 'length', 'prototype' and 'name').
      const concreteStaticMethods = Object.getOwnPropertyNames(implementer.constructor).filter((key) => key !== 'length' && key !== 'prototype' && key !== 'name');

      // For each static method defined on the abstract interface...
      for (const staticMethod of abstractStaticMethods) {

        // ...if the implementer is MISSING said static abstract interface method... KA-BOOM!
        if (!concreteStaticMethods.includes(staticMethod)) {
          const message = `Class '${implementer.constructor.name}' must implement the '${staticMethod}' method as static to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }
      }

      // For each method defined on the abstract interface...
      for (const method of abstractMethods) {

        // ...if the implementer is MISSING said abstract interface method... KA-BOOM!
        if (!concreteMethods.includes(method)) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // ...if it's NOT missing, but the abstract interface and concrete implementer differ in the ASYNC quality of the methods being compared...
        if (!(Object.is(abstractInterface[method].constructor, implementer[method].constructor))) {

          // If the abstract interface specifically defined an async method... KA-BOOM!
          if (Object.is(abstractInterface[method].constructor, (async function(){}).constructor)) {
            const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as async to fulfill the '${abstractInterface.constructor.name}' interface.`;
            throw new TypeError(message);
          }

          // Or else -- meaning; if the abstract interface specifically defined a regular ('synchronous') method... KA-BOOM!
          else {
            const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as non-async to fulfill the '${abstractInterface.constructor.name}' interface.`;
            throw new TypeError(message);
          }
        }

        // Property descriptor comparisons begin here! *trumpets blow*

        // We retrieve the corresponding descriptor for the current method (from each object, respectively).
        const abstractDescriptor = Object.getOwnPropertyDescriptor(abstractInterface, method);
        const concreteDescriptor = Object.getOwnPropertyDescriptor(implementer, method);

        // If the interface defines a 'regular' (non-accessor) method which the implementer does not... KA-BOOM!
        if (abstractDescriptor.value && !concreteDescriptor.value) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // If the interface defines a getter method which the implementer does not... KA-BOOM!
        if (abstractDescriptor.get && !concreteDescriptor.get) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as a getter to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }

        // If the interface defines a setter method which the implementer does not... KA-BOOM!
        if (abstractDescriptor.set && !concreteDescriptor.set) {
          const message = `Class '${implementer.constructor.name}' must implement the '${method}' method as a setter to fulfill the '${abstractInterface.constructor.name}' interface.`;
          throw new TypeError(message);
        }
      }
    }
  prototypeTable.set([Symbol.for(this.constructor), true]); // Lastly, if we got this far without blowing up, memoize processed implementation as Good(TM)
  }
}

// Barring 'new ABC.constructor()' shenanigans, by overwriting ABC's own constructor with a proxied version of itself.
ABC.constructor = Object.freeze(new Proxy(ABC.constructor, Object.freeze({
  construct() {
    // Current implementation: if (prototypeTable.get(Symbol.for(this.constructor)) === false) throw new TypeError(`NUH-UH!`);
    // TODO: Here we could reflect onto the caller, seizing the opportunity to produce a more contextual (read: helpful) error message.
    const message = `An Abstract Base Class (ABC) cannot be instantiated indirectly, either.`;
    throw new TypeError(message);
  },
})));

prototypeTable.set([Symbol.for(ABC), false]);

module.exports = { ABC: Object.freeze(ABC) };

Object.freeze(module.exports);
