import Joi from 'joi';
import { safeText } from './common.js';

const status = Joi.string().valid('todo', 'in_progress', 'done');
const priority = Joi.string().valid('low', 'medium', 'high');
const dueDate = Joi.date().iso().allow(null);
const assigneeId = Joi.string().uuid().allow(null);

export const createTaskSchema = Joi.object({
    teamId: Joi.string().uuid().required(),
    title: safeText(150).min(2).required(),
    description: safeText(2000).allow('', null),
    status,
    priority,
    dueDate,
    assigneeId,
});

export const updateTaskSchema = Joi.object({
    title: safeText(150).min(2),
    description: safeText(2000).allow('', null),
    status,
    priority,
    dueDate,
    assigneeId,
}).min(1);

export const taskQuerySchema = Joi.object({
    teamId: Joi
        .string()
        .uuid(),
    assigneeId: Joi
        .alternatives()
        .try(
            Joi.string()
                .uuid(),
            Joi
                .string()
                .valid('me')),
    status,
    search: safeText(100),
    page: Joi
        .number()
        .integer()
        .min(1)
        .default(1),
    limit: Joi
        .number()
        .integer()
        .min(1)
        .max(100)
        .default(20),
});