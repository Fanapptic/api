module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'border',
    validate: validate || (input => {
      return (input) ? true : false;
    }),
  };
};
