import ApiError from '../utils/ApiError.js';

export default (req, res, next) =>
  req.isAuthenticated() ? next() : next(new ApiError(401, 'Please log in first'));