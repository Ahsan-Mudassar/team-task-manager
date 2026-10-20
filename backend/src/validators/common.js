import Joi from 'joi';

export const safeText = (max) =>
  Joi.string().trim().max(max).pattern(/^[^<>]*$/)
    .messages({ 'string.pattern.base': '{{#label}} must not contain < or >' });

export const uuidParams = (...names) =>
  Joi.object(Object.fromEntries(names.map((n) => [n, Joi.string().uuid().required()])));