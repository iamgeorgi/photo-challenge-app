import passportJwt from 'passport-jwt';
import { PRIVATE_KEY } from '../../config.js';

const options = {
    secretOrKey: PRIVATE_KEY,
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtStrategy = new passportJwt.Strategy(options, async (payload, done) => {
    const userData = {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
    };

    // userData will be set as `req.user` in the `next` middleware
    done(null, userData);
});

export default jwtStrategy;
