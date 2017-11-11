module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'authorize',
    validate: validate || (() => {
      return true;
    }),
  };
};
