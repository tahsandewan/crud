export const validateNull = (str) => {
  if (str == null || str === "") {
    return false;
  }
  return true;
};

export const validateLength = (value, length) => {
  if (value == null) {
    return false;
  }
  return value.length <= length;
};











