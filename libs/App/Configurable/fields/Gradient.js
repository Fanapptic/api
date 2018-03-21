module.exports = (overrides = {}) => {
  const { validate } = overrides;

  return {
    name: 'gradient',
    validate: validate || (input => {
      return (input && input.includes(',') && !input.includes(' ')) ? true : false;
    }),
  };
};
