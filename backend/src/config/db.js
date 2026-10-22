import { Sequelize } from 'sequelize';
import { pgPoolConfig, usePartsConfig } from './dbConfig.js';

const options = { dialect: 'postgres', logging: false };

const sequelize = usePartsConfig
  ? new Sequelize(pgPoolConfig.database, pgPoolConfig.user, pgPoolConfig.password, {
    ...options,
    host: pgPoolConfig.host,
    port: pgPoolConfig.port,
  })
  : new Sequelize(process.env.DB_URL, options);

export { sequelize };