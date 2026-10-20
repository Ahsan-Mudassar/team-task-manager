import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { uuidParams } from '../validators/common.js';
import {
  createTaskSchema, updateTaskSchema, taskQuerySchema,
} from '../validators/task.schema.js';
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  getReminders
} from '../controllers/task.controller.js';

const router = Router();

router
  .route('/')
  .get(validate(taskQuerySchema, 'query'), listTasks)
  .post(validate(createTaskSchema), createTask);
router.get('/reminders', getReminders);

router.use('/:taskId', validate(uuidParams('taskId'), 'params'));

router
  .route('/:taskId')
  .get(getTask)
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;