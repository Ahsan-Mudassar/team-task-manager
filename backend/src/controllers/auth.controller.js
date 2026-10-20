import passport from 'passport';
import { User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const logIn = (req, user) =>
  new Promise((resolve, reject) => req.login(user, (err) => (err ? reject(err) : resolve())));

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const isExistEmail = await User.findOne({ where: { email } });

  if (isExistEmail) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({ name, email, password });

  await logIn(req, user);

  res
    .status(201)
    .json({
      user,
      message: "User registered successfuly"
    });
});

export const login = (req, res, next) => {
  passport.authenticate('local', async (err, user) => {

    if (err) return next(err);

    if (!user) return next(new ApiError(401, 'Invalid email or password'));

    try {
      await logIn(req, user);
      res.json({ user });
    } catch (e) {
      next(e);
    }

  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req
      .session
      .destroy((err2) => {
        if (err2) return next(err2);

        res.clearCookie('connect.sid');
        res
          .json({
            message: 'Logged out'
          });
      });

  });
};

export const me = (req, res) => res.json({ user: req.user });
