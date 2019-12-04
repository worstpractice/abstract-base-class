`use strict`;
const { ABC } = require('../abc.js');


describe(`the abstract base class 'ABC'`, () => {

  describe(`when examined prototypically`, () => {

    it(`should be a direct subclass of 'Function'`, () => {
      expect(Object.getPrototypeOf(ABC)).toBe(Object.getPrototypeOf(Function));
    });
  });

  describe(`when instantiated directly`, () => {

    it(`should be abstract`, () => {
      expect(() => {
        new ABC();
      }).toThrowError(TypeError);
    });
  });

  describe(`when instantiated indirectly`, () => {

    it(`should still be abstract`, () => {
      expect(() => {
        new ABC.constructor();
      }).toThrowError(TypeError);
    });
  });

  describe(`when inherited from directly`, () => {

    describe(`the 'ABC' class`, () => {

      describe(`when defined`, () => {

        it(`should not throw any exceptions`, () => {
          expect(() => {
            class ThisShouldWork extends ABC { };
          }).not.toThrow();
        });

        it(`should be considered the superclass of its direct subclass`, () => {
          expect(Object.getPrototypeOf(class ThisShouldWork extends ABC { })).toBe(ABC);
        });
      });
    });

    describe(`the direct subclass of 'ABC'`, () => {

      describe(`when instantiated directly`, () => {

        it(`should be abstract`, () => {
          class AbstractInterface extends ABC { };
          expect(() => {
            new AbstractInterface();
          }).toThrowError(TypeError);
        });
      });

      describe(`when instantiated indirectly`, () => {

        it(`should still be abstract`, () => {
          class AbstractInterface extends ABC { };
          expect(() => {
            new AbstractInterface.constructor();
          }).toThrowError(TypeError);
        });
      });

      describe(`when defined`, () => {

        it(`should be fully customizable`, () => {
          expect(() => {
            class AbstractInterface extends ABC {
              foo() { }
            }
          }).not.toThrow();
        });
      });

      describe(`when inherited from directly (in turn), the abstract interface`, () => {

        describe(`when defined`, () => {

          it(`should not throw any exceptions`, () => {
            expect(() => {
              class AbstractInterface extends ABC { }
              class ConcreteImplementer extends AbstractInterface { }
            }).not.toThrow();
          });

          it(`should be considered the subclass of its direct superclass`, () => {
            class AbstractInterface extends ABC { }
            class ConcreteImplementer extends AbstractInterface { }
            expect(Object.getPrototypeOf(ConcreteImplementer)).toBe(AbstractInterface);
          });

          it(`should be customizable with arbitrary methods and properties`, () => {
            expect(() => {
              class AbstractInterface extends ABC {
                constructor() {
                  super();
                }
                foo() { }
              }
            }).not.toThrow();
          });
        });

        describe(`the direct subclass of the abstract interface`, () => {

          describe(`when instantiated directly`, () => {

            it(`should be concrete`, () => {
              class AbstractInterface extends ABC { }
              class ConcreteImplementer extends AbstractInterface { }
              expect(() => {
                new ConcreteImplementer();
              }).not.toThrow();
            });

            describe(`when instantiated indirectly`, () => {

              it(`should still be abstract`, () => {
                class AbstractInterface extends ABC { }
                class ConcreteImplementer extends AbstractInterface { }
                expect(() => {
                  new ConcreteImplementer.constructor();
                }).toThrowError(TypeError);
              });
            });

            it(`should be required to implement its parent interface`, () => {
              expect(() => {
                class AbstractInterface extends ABC {
                  constructor() {
                    super();
                  }
                  hello() { }
                  static bar() {}
                  get baz() {}
                }
                class ConcreteImplementer extends AbstractInterface {
                  constructor() {
                    super();
                  }
                }
                new ConcreteImplementer();
              }).toThrowError(TypeError);
            });

            it(`including getter methods`, () => {
              expect(() => {
                class AbstractInterface extends ABC {
                  constructor() {
                    super();
                  }
                  get foo() { }
                }
                class ConcreteImplementer extends AbstractInterface {
                  constructor() {
                    super();
                  }
                }
                new ConcreteImplementer();
              }).toThrowError(TypeError);
            });

            it(`including setter methods`, () => {
              expect(() => {
                class AbstractInterface extends ABC {
                  constructor() {
                    super();
                  }
                  set foo(bar) { }
                }
                class ConcreteImplementer extends AbstractInterface {
                  constructor() {
                    super();
                  }
                }
                new ConcreteImplementer();
              }).toThrowError(TypeError);
            });

            it(`including static methods`, () => {
              expect(() => {
                class AbstractInterface extends ABC {
                  constructor() {
                    super();
                  }
                  static foo() { }
                }
                class ConcreteImplementer extends AbstractInterface {
                  constructor() {
                    super();
                  }
                }
                new ConcreteImplementer();
              }).toThrowError(TypeError);
            });

            it(`including async methods`, () => {
              expect(() => {
                class AbstractInterface extends ABC {
                  constructor() {
                    super();
                  }
                  async foo() { }
                }
                class ConcreteImplementer extends AbstractInterface {
                  constructor() {
                    super();
                  }
                }
                new ConcreteImplementer();
              }).toThrowError(TypeError);
            });

          //   describe(`once having implemented its parent interface`, () => {

          });
        });
      });
    });
  });
});

