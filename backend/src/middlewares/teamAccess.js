import { TeamMember } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const requireTeamRole = (...roles) =>
    asyncHandler(async (req, res, next) => {
        const membership = await TeamMember.findOne({
            where: { teamId: req.params.teamId, userId: req.user.id },
        });

        if (!membership) throw new ApiError(404, 'Team not found');

        if (roles.length && !roles.includes(membership.role)) {
            throw new ApiError(403, 'You do not have permission for this action');
        }
        
        req.membership = membership;
        next();
    });

export const requireTeamMember = requireTeamRole();
export const requireTeamOwner = requireTeamRole('owner'); 