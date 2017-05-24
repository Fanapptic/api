module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'pixel',
    validate: validate || ((input) => {
      return (input) ? true : false;
    }),
  };
};
