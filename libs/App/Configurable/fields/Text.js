module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'text',
    validate: validate || (input => {
      return (input) ? true : false;
    }),
  };
};
