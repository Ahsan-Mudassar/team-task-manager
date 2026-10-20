import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Task extends Model { }

Task.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('todo', 'in_progress', 'done'),
            allowNull: false,
            defaultValue: 'todo',
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            allowNull: false,
            defaultValue: 'medium',
        },
        dueDate: {
            type: DataTypes.DATEONLY
        },
        teamId: {
            type: DataTypes.UUID
            , allowNull: false
        },
        assigneeId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        createdById: {
            type: DataTypes.UUID,
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks'
    }
);

export default Task;