import { sequelize } from '../config/db.js';
import { TeamMember, Task, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const addMember = asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) throw new ApiError(404, 'No user registered with this email');

    const exists = await TeamMember.findOne({ where: { teamId, userId: user.id } });

    if (exists) throw new ApiError(409, 'User is already a team member');

    await TeamMember.create({
        teamId,
        userId: user.id,
        role: 'member'
    });

    res
        .status(201)
        .json({
            member: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'member'
            }
        });
});

export const removeMember = asyncHandler(async (req, res) => {
    const { teamId, userId } = req.params;
    const isSelf = userId === req.user.id;

    if (!isSelf && req.membership.role !== 'owner') {
        throw new ApiError(403, 'You do not have permission for this action');
    }

    const target = await TeamMember.findOne({ where: { teamId, userId } });

    if (!target) throw new ApiError(404, 'Member not found');
    if (target.role === 'owner') {
        throw new ApiError(400, 'Owner cannot be removed. Delete the team instead');
    }

    await sequelize.transaction(async (t) => {
        await TeamMember.destroy({ where: { teamId, userId }, transaction: t });

        await Task.update(
            { assigneeId: null },
            { where: { teamId, assigneeId: userId }, transaction: t }
        );
    });

    res
        .status(204)
        .end();
});