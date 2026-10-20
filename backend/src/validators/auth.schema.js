import Joi from 'joi';
import { safeText } from './common.js';

const email = Joi
    .string()
    .trim()
    .lowercase()
    .email()
    .max(120)
    .required();

export const registerSchema = Joi.object({
    name: safeText(80).min(2).required(),
    email,
    password: Joi
        .string()
        .min(8)
        .max(72)
        .pattern(/[A-Za-z]/)
        .pattern(/\d/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain letters and numbers'
        }),
});

export const loginSchema = Joi.object({
    email,
    password: Joi.string().max(72).required(),
});