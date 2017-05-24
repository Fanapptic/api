module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'textArea',
    validate: validate || ((input) => {
      return (input) ? true : false;
    }),
  };
};
