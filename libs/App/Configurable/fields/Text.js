module.exports = (overrides = {}) => {
  const { attributes, validate } = overrides;

  return {
    name: 'text',
    attributes,
    validate: validate || (input => {
      return (typeof input === 'string') ? true : false;
    }),
  };
};
