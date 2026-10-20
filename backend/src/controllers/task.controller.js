import { Op } from 'sequelize';
import { Task, Team, TeamMember, User } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const taskInclude = [
    {
        model: User,
        as: 'assignee',
        attributes: ['id', 'name'],
    },
    {
        model: Team,
        as: 'team',
        attributes: ['id', 'name'],
    },
];

const getMembership = async (teamId, userId) => {
    const membership = await TeamMember.findOne({ where: { teamId, userId } });
    if (!membership) throw new ApiError(404, 'Team not found');
    return membership;
};

const assertAssigneeInTeam = async (teamId, assigneeId) => {
    if (!assigneeId) return;
    const isMember = await TeamMember.findOne({ where: { teamId, userId: assigneeId } });
    if (!isMember) throw new ApiError(400, 'Assignee must be a member of the team');
};

const findTaskForUser = async (taskId, userId) => {
    const task = await Task.findByPk(taskId, {
        include: taskInclude,
    });
    if (!task) throw new ApiError(404, 'Task not found');

    const membership = await getMembership(task.teamId, userId);

    return { task, membership };
};

export const createTask = asyncHandler(async (req, res) => {
    const { teamId, assigneeId } = req.body;

    await getMembership(teamId, req.user.id);
    await assertAssigneeInTeam(teamId, assigneeId);

    const created = await Task.create({ ...req.body, createdById: req.user.id });
    const task = await Task.findByPk(created.id, {
        include: taskInclude,
    });

    res.status(201).json({ task, meesage: "Your task created successfull" });
});

export const listTasks = asyncHandler(async (req, res) => {
    const { teamId, assigneeId, status, search, page, limit } = req.validated.query;

    const memberships = await TeamMember.findAll({
        where: { userId: req.user.id },
        attributes: ['teamId'],
    });

    const myTeamIds = memberships.map((m) => m.teamId);
    if (teamId && !myTeamIds.includes(teamId)) throw new ApiError(404, 'Team not found');

    const where = { teamId: teamId ?? myTeamIds };
    if (assigneeId) where.assigneeId = assigneeId === 'me' ? req.user.id : assigneeId;
    if (status) where.status = status;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { rows, count } = await Task.findAndCountAll({
        where,
        include: taskInclude,
        order: [['createdAt', 'DESC']],
        limit,
        offset: (page - 1) * limit,
    });

    res.json({
        tasks: rows,
        pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil(count / limit),
        },
        message: "Your list of task fetch successful"
    });
});

export const getTask = asyncHandler(async (req, res) => {
    const { task } = await findTaskForUser(req.params.taskId, req.user.id);

    res
        .status(200)
        .json({
            task,
            message: "Your task fetch successful"
        });
});

export const updateTask = asyncHandler(async (req, res) => {
    const { task } = await findTaskForUser(req.params.taskId, req.user.id);

    if ('assigneeId' in req.body) await assertAssigneeInTeam(task.teamId, req.body.assigneeId);

    await task.update(req.body);
    await task.reload({ include: taskInclude });

    res
        .status(200)
        .json({
            task,
            message: "Updated task successful"
        });
});

export const deleteTask = asyncHandler(async (req, res) => {
    const { task, membership } = await findTaskForUser(req.params.taskId, req.user.id);

    if (membership.role !== 'owner' && task.createdById !== req.user.id) {
        throw new ApiError(403, 'You do not have permission for this action');
    }

    await task.destroy();
    res
        .status(204)
        .json({ message: "Task deleted successfully" });
});