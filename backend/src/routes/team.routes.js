import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { requireTeamMember, requireTeamOwner } from '../middlewares/teamAccess.js';
import { uuidParams } from '../validators/common.js';
import { createTeamSchema, updateTeamSchema } from '../validators/team.schema.js';
import {
    createTeam,
    listMyTeams,
    getTeam,
    updateTeam,
    deleteTeam,
} from '../controllers/team.controller.js';
import memberRoutes from './member.routes.js';

const router = Router();

router.route('/').get(listMyTeams).post(validate(createTeamSchema), createTeam);

router.use('/:teamId', validate(uuidParams('teamId'), 'params'));
router.use('/:teamId/members', memberRoutes);

router
    .route('/:teamId')
    .get(requireTeamMember, getTeam)
    .patch(requireTeamOwner, validate(updateTeamSchema), updateTeam)
    .delete(requireTeamOwner, deleteTeam);

export default router;