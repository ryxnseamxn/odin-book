let EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Snap",
    tableName: "Snaps",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        filepath: {
            type: "varchar",
            nullable: false,
        },
        timestamp: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP"
        },
        isOpened: {
            type: "boolean",
            default: false
        },
        expiresAt: {
            type: "timestamp",
            nullable: true
        },
        caption: {
            type: "varchar",
            nullable: true
        }
    },
    relations: {
        sender: {
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "sender_id",
                referencedColumnName: "id"
            }
        },
        recipient: {
            target: "User", 
            type: "many-to-one",
            joinColumn: {
                name: "recipient_id",
                referencedColumnName: "id"
            }
        }
    }
});