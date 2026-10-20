import { Router } from 'express';
import validate from '../middlewares/validate.js';
import { requireTeamMember, requireTeamOwner } from '../middlewares/teamAccess.js';
import { uuidParams } from '../validators/common.js';
import { addMemberSchema } from '../validators/team.schema.js';
import { addMember, removeMember } from '../controllers/member.controller.js';

const router = Router({ mergeParams: true });

router.post('/', requireTeamOwner, validate(addMemberSchema), addMember);

router.delete('/:userId', requireTeamMember, validate(uuidParams('userId'), 'params'), removeMember);

export default router;