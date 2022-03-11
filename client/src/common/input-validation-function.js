export const isInputValid = (input, validations) => {
  let isValid = true;

  if (validations.required) {
    isValid = isValid && input.length !== 0;
  }
  if (validations.minLength) {
    isValid = isValid && input.length >= validations.minLength;
  }
  if (validations.maxLength) {
    isValid = isValid && input.length <= validations.maxLength;
  }
  if (validations.min) {
    isValid = isValid && input >= validations.min;
  }
  if (validations.max) {
    isValid = isValid && input <= validations.max;
  }


  return isValid;
};

