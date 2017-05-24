const Joi = require('joi');
const Configurable = require('./Configurable');

module.exports = class extends Configurable {
  constructor() {
    super();

    this.title = '';
    this.icon = {
      set: null,
      name: null,
    };
  }

  exportValue() {
    return this;
  }

  importValueAndValidate(value) {
    const schema = Joi.object({
      title: Joi.string().required(),
      icon: Joi.object({
        set: Joi.string().required(),
        name: Joi.string().required(),
      }).required(),
    });

    Joi.assert(value, schema);

    Object.assign(this, value);

    return true;
  }
};

/*
"tab": {
  "icon": {
    "set": "IonIcons",
    "name": "ios-paper"
  },
  "title": "News"
},
*/
