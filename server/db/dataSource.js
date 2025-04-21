const path = require('path');
const { DataSource } = require('typeorm');

const env = process.env.NODE_ENV || 'development';

let connectionOptions = {};
if (env === 'production') {
  connectionOptions = {
    url: process.env.DATABASE_URL,
    type: 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };

} else {
  connectionOptions = {
    type: 'postgres',
    host: process.env.DATABASE_URL_LOCAL,
    port: process.env.DATABASE_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
}

const config = {
  ...connectionOptions,
  entities: [__dirname + '/entities/*.js'],
  migrations: [path.join(__dirname, 'migrations', '*.js')],
  synchronize: env === 'development',
};

const dataSource = new DataSource(config);
module.exports = dataSource; 