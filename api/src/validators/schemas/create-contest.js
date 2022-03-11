export const createContestSchema = {
  title: value => {
    if (!value) {

      return 'Title is required!';
    }

    if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 50) {

      return 'Title should be a string in range [3..50]!';
    }

    return null;
  },
  category: value => {
    if (!value) {

      return 'Category is required!';
    }
    if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 50) {

      return 'Category should be a string in range [3..50]!';
    }

    return null;
  },
  isopen: value => {
    if (value === undefined) {

      return 'Please select the contest type!';
    }
    return null;
  },
  phase1: value => {
    if (!value) {

      return 'Phase one is required!';
    }
    if (value < 1 || value > 30) {

      return 'Phase one should be between 1 and 30 days!';
    }
    return null;
  },
  phase2: value => {
    if (!value) {

      return 'Phase two is required!';
    }
    if (value < 1 || value > 24) {

      return 'Phase two should be between 1 and 24 hours!';
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