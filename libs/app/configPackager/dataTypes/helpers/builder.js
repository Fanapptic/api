module.exports = (validator) => {
  return {
    REQUIRED: (defaultValue) => ({
      defaultValue,
      validator,
      required: true,
    }),
    OPTIONAL: (defaultValue) => ({
      defaultValue,
      validator,
      required: false,
    }),
    validator,
  };
};
