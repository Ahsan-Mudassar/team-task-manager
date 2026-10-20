import User from './User.js';
import Team from './Team.js';
import TeamMember from './TeamMember.js';
import Task from './Task.js';

User.hasMany(Team, { foreignKey: 'creatorId', as: 'createdTeams' });
Team.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

User.belongsToMany(Team, { through: TeamMember, foreignKey: 'userId', otherKey: 'teamId', as: 'teams' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'teamId', otherKey: 'userId', as: 'members' });

Team.hasMany(Task, { foreignKey: 'teamId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

User.hasMany(Task, { foreignKey: 'assigneeId', as: 'assignedTasks', onDelete: 'SET NULL' });
Task.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

Task.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

export { User, Team, TeamMember, Task };