export const updateUserSchema = {
    firstname: value => {
        if (!value) {
            return null;
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'First Name should be a string in range [3..25]';
        }

        return null;
    },
    lastname: value => {
        if (!value) {
            return null;
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'Last Name should be a string in range [3..25]';
        }

        return null;
    },
};