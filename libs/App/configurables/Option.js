const Configurable = require('../Configurable');

class Option extends Configurable {
  constructor(initObject) {
    initObject.type = 'option';

    super(initObject);
  }
}

module.exports = Option;
