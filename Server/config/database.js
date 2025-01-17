// config/database.js
import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        statement_timeout: 1000,
        idle_in_transaction_session_timeout: 10000
    }
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Terminar el proceso si no se puede conectar
    }
};

// Probar la conexión al importar el módulo
await testConnection();

export default sequelize;