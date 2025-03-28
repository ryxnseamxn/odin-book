const { DataSource } = require('typeorm');

const dataSource = new DataSource ({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    database: "postgres",
    entities: [__dirname + "/db/entities/*.js"],
    synchronize: true,
  });

module.exports = dataSource;