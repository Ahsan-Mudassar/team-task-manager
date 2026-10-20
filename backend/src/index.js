import dotenv from 'dotenv'
dotenv.config();
import app from './app.js';
import { sequelize } from './config/db.js';
import './models/index.js'

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');
        await sequelize.sync(); 

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Startup failed:', err);
        process.exit(1);
    }
};

start();