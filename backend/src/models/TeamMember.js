import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class TeamMember extends Model { }

TeamMember.init(
    {
        userId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        teamId: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        role: {
            type: DataTypes.ENUM('owner', 'member'),
            allowNull: false,
            defaultValue: 'member',
        },
    },
    {
        sequelize,
        modelName: 'TeamMember',
        tableName: 'team_members'
    }
);

export default TeamMember;