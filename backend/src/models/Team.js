import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Team extends Model { }

Team.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        creatorId: {
            type: DataTypes.UUID,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'Team',
        tableName: 'teams'
    }
);

export default Team;