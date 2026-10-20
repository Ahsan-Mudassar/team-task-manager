import Joi from 'joi';
import { safeText } from './common.js';

export const createTeamSchema = Joi.object({
  name: safeText(100).min(2).required(),
  description: safeText(500).allow('', null),
});

export const updateTeamSchema = Joi.object({
  name: safeText(100).min(2),
  description: safeText(500).allow('', null),
}).min(1);

export const addMemberSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().max(120).required(),
});