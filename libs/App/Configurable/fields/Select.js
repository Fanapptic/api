module.exports = (overrides = {}) => {
  const { options, validate } = overrides;

  return {
    name: 'select',
    options,
    validate: validate || (input => {
      return options.some(option => option.value === input);
    }),
  };
};
