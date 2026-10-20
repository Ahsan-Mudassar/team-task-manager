import { sequelize } from '../config/db.js';
import { Team, TeamMember, User } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createTeam = asyncHandler(async (req, res) => {

    const team = await sequelize.transaction(async (t) => {
        const created = await Team.create(
            { ...req.body, creatorId: req.user.id },
            { transaction: t }
        );

        await TeamMember.create(
            { teamId: created.id, userId: req.user.id, role: 'owner' },
            { transaction: t }
        );

        return created;
    });
    res
        .status(201)
        .json({ team, message: "Team successfully created" });
});

export const listMyTeams = asyncHandler(async (req, res) => {
    const teams = await req.user.getTeams({ joinTableAttributes: ['role'] });

    res
        .status(200)
        .json({
            teams: teams.map((t) => ({ ...t.toJSON(), role: t.TeamMember.role })),
            message: "Your teams list fetch successfuly"
        });
});

export const getTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId

    const team = await Team.findByPk(teamId, {
        include: [
            {
                model: User,
                as: 'members',
                attributes: ['id', 'name', 'email'],
                through: { attributes: ['role'] },
            },
        ],
    });
    res
        .status(200)
        .json({
            team,
            message: "Team fetch successfuly"
        });
});

export const updateTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId
    const team = await Team.findByPk(teamId);
    await team.update(req.body);

    res
        .status(200)
        .json({ team });
});

export const deleteTeam = asyncHandler(async (req, res) => {
    const teamId = req.params.teamId
    await Team.destroy({ where: { id: teamId } });

    res
        .status(204)
        .json({ message: "Team successfuly deleted" });
});