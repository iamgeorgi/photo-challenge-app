let wrongCategorySelected = false;
export const juryScoringSchema = {
  wrong_category: value => {
    if (value === 1) {
     wrongCategorySelected = true;
    }
    return null;
  },
  score: value => {
    if (value === undefined && !wrongCategorySelected) {

      return 'Score is required!';
    }

    if ((value < 1 || value > 10) && !wrongCategorySelected) {

      return 'The score should be between 1 and 10!';
    }

    return null;
  },
  comment: value => {
    if (!value && !wrongCategorySelected) {
      return 'Comment is required!';
    }
    if ((typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 256) && !wrongCategorySelected) {

      return 'Comment should be a string in range [3..256]!';
    }
    
    return null;
  },
};