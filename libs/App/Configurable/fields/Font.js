module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'font',
    validate: validate || (input => {
      return (input) ? true : false;
    }),
  };
};
