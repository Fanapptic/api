module.exports = (options) => {
  return {
    name: 'select',
    options,
    validate: (input) => {
      return options.some(option => option.value === input);
    },
  };
};
