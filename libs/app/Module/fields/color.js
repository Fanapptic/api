module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'color',
    validate: validate || ((input) => {
      return (input) ? true : false;
    }),
  };
};
