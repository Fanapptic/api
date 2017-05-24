class Configurable {
  constructor() {
    if (new.target === Configurable) {
      throw new TypeError('Cannot construct Configurable instances directly.');
    }
  }

  exportValue() {
    return null;
  }

  importValueAndValidate() {
    return true;
  }
}

module.exports = Configurable;
