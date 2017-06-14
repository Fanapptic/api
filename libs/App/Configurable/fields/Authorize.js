module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'authorize',
    validate: validate || (input => {
      return (input) ? true : false;
    }),
  };
};
