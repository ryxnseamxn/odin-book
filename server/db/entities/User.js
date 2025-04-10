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
        username: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        }
    },
    relations: {
        friends: {
            target: "User", 
            type: "many-to-many",
            joinTable: {
                name: "Friends", 
                joinColumn: {
                    name: "user_id",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "friend_id",
                    referencedColumnName: "id"
                }
            },
            cascade: true 
        }
    }
});