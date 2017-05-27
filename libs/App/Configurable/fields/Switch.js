module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'switch',
    validate: validate || ((input) => {
      return (input) ? true : false;
    }),
  };
};
