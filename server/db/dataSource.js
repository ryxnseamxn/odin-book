const { DataSource } = require('typeorm');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
    type: 'postgres',
    entities: [__dirname + '/entities/*.js'],
};

const config = env === 'production'
    ? {
        ...baseConfig,
        url: process.env.DB_URL,
        ssl: process.env.DB_SSL === 'true',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        migrations: [__dirname + '/migrations/*.js'],
    }
    : {
        ...baseConfig,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USERNAME,
        database: process.env.DB_DATABASE,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        password: process.env.DB_PASSWORD
    };

const dataSource = new DataSource(config);

module.exports = dataSource;