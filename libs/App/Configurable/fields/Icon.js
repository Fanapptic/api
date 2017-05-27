module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'icon',
    validate: validate || ((input) => {
      return (input) ? true : false;
    }),
  };
};
