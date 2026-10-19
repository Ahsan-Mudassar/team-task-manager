// import passport from 'passport'
// import LocalStrategy from 'passport-local'
// import bcrypt from 'bcrypt'
// import {User} from '../models'

// passport.use(
//   new LocalStrategy.Strategy({ usernameField: 'email' }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ where: { email } });
//       if (!user) return done(null, false);
//       const match = await bcrypt.compare(password, user.password);
//       return match ? done(null, user) : done(null, false);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// passport.serializeUser((user, done) => done(null, user.id));

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// export default passport;