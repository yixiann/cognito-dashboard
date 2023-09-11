export const isObjectEmptyOrAllNullValues = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  if (Object.keys(obj).length === 0) {
    return true;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null) {
      return false;
    }
  }

  return true;
};

export const makePlural = (word, number) => {
  return number === 1 ? word : word + "s";
};
