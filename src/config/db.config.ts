import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || '10.18.250.178',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'oteroc',
    password: process.env.DB_PASSWORD || 'oteroc',
    database: process.env.DB_NAME || 'legal_db_test',
});

// Test connection
pool.on('connect', () => {
    console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en el pool de PostgreSQL:', err);
});

export default pool;
