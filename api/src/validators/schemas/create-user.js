export const createUserSchema = {
    username: value => {
        if (!value) {
            return 'Username is required';
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'Username should be a string in range [3..25]';
        }

        return null;
    },
    password: value => {
        if (!value) {
            return 'Password is required';
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'Password should be a string in range [3..25]';
        }

        return null;
    },
    firstname: value => {
        if (!value) {
            return 'First Name is required';
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'First Name should be a string in range [3..25]';
        }

        return null;
    },
    lastname: value => {
        if (!value) {
            return 'Last Name is required';
        }
        
        if (typeof value !== 'string' || value.length < 3 || value.length > 25) {
            return 'Last Name should be a string in range [3..25]';
        }

        return null;
    },
};