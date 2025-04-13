const { DataSource } = require('typeorm');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const env = process.env.NODE_ENV || 'development';

// Extract connection details from the DB_HOST connection string if in production
let connectionOptions = {};
if (env === 'production' && process.env.DB_HOST && process.env.DB_HOST.startsWith('postgresql://')) {
  // We're manually parsing the connection string
  connectionOptions = {
    url: process.env.DB_HOST,
    type: 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
} else {
  // Development mode or if DB_HOST isn't a connection string
  connectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
}

const config = {
  ...connectionOptions,
  entities: [__dirname + '/entities/*.js'],
  migrations: [__dirname + '/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
};

const dataSource = new DataSource(config);

module.exports = dataSource;