let EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User", 
    tableName: "Users", 
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
    },
});
