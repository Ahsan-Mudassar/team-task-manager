import ApiError from '../utils/ApiError.js';

export default (schema, source = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const details = error.details.map((d) => ({ field: d.path.join('.'), message: d.message }));
    return next(new ApiError(400, 'Validation failed', details));
  }
  req.validated = { ...req.validated, [source]: value };
  if (source === 'body') req.body = value;
  next();
};