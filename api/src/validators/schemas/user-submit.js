export const userSubmitSchema = {
  title: value => {
    if (!value) {

      return 'Title is required!';
    }

    if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 45) {

      return 'Title should be a string in range [3..45]!';
    }

    return null;
  },
  story: value => {
    if (!value) {
      return 'Story is required!';
    }
    if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 256) {

      return 'Story should be a string in range [3..256]!';
    }

    return null;
  },
  filename: value => {
    if (!value) {

      return 'Photo is required!';
    }
    if (typeof value !== 'string' || value.trim().length < 20 || value.trim().length > 256) {

      return 'Photo should be a string in range [20..256]!';
    }

    return null;
  },
};