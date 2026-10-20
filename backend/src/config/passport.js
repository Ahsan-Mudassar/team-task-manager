import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/index.js';

passport.use(
    new LocalStrategy({
        usernameField: 'email'
    },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
                
                if (!user || !(await user.comparePassword(password))) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        done(null, await User.findByPk(id));
    } catch (err) {
        done(err);
    }
});

export default passport;