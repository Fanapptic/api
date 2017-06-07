module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'gif',
    validate: validate || (input => {
      return (input) ? true : false;
    }),
  };
};
