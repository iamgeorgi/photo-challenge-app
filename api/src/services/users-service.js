import serviceErrors from './service-errors.js';
import bcrypt from 'bcryptjs';
import { DEFAULT_USER_ROLE } from '../../config.js';

const getAllPhotoJunkies = usersData => {
    return async () => {
        const result = await usersData.getUsersByRole(2);

        if (result.length < 1) {

            return {
                error: serviceErrors.RECORD_NOT_FOUND,
                users: null,
            };
        }

        return {
            error: null,
            users: result,
        };
    };
};

const getUserById = usersData => {
    return async (id) => {
        const user = await usersData.getBy('id', id);

        if (!user) {
            return {
                error: serviceErrors.RECORD_NOT_FOUND,
                user: null,
            };
        } else if (isNaN(id)) {
            return {
                error: serviceErrors.OPERATION_NOT_PERMITTED,
                user: null,
            };
        }

        return { error: null, user: user };
    };
};

const createUser = usersData => {
    return async (userCreate) => {
        const { username, password, firstname, lastname, email } = userCreate;

        const existingUser = await usersData.getBy('username', username);

        if (existingUser) {
            return {
                error: serviceErrors.DUPLICATE_RECORD,
                users: null,
            };
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await usersData.create(username, firstname, lastname, passwordHash, email, DEFAULT_USER_ROLE);

        return { error: null, user: user };
    };
};

const updateUser = usersData => {
    return async (id, userUpdate) => {
        const user = await usersData.getBy('id', id);
        if (!user) {
            return {
                error: serviceErrors.RECORD_NOT_FOUND,
                user: null,
            };
        }

        const updated = { ...user, ...userUpdate };
        await usersData.update(updated);

        return { error: null, user: updated };
    };
};

const signInUser = usersData => {
    return async (username, password) => {
        const user = await usersData.getBy('username', username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return {
                error: serviceErrors.INVALID_SIGNIN,
                user: null,
            };
        }

        return {
            error: null,
            user: user,
        };
    };
};


export default {
    getAllPhotoJunkies,
    createUser,
    updateUser,
    getUserById,
    signInUser,
};