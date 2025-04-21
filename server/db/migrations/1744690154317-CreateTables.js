"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTables1744690154317 = void 0;
class CreateTables1744690154317 {
    constructor() {
        this.name = 'CreateTables1744690154317';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`CREATE TABLE "Friends" ("user_id" integer NOT NULL, "friend_id" integer NOT NULL, CONSTRAINT "PK_fbbab4c89ece262e09f1cd83a4e" PRIMARY KEY ("user_id", "friend_id"))`);
            yield queryRunner.query(`CREATE INDEX "IDX_e80b443c8d4e8ff5cd872ec77f" ON "Friends" ("user_id") `);
            yield queryRunner.query(`CREATE INDEX "IDX_320fe24a7a562b481c25cea344" ON "Friends" ("friend_id") `);
            yield queryRunner.query(`ALTER TABLE "Friends" ADD CONSTRAINT "FK_e80b443c8d4e8ff5cd872ec77f9" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
            yield queryRunner.query(`ALTER TABLE "Friends" ADD CONSTRAINT "FK_320fe24a7a562b481c25cea3442" FOREIGN KEY ("friend_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Friends" DROP CONSTRAINT "FK_320fe24a7a562b481c25cea3442"`);
            yield queryRunner.query(`ALTER TABLE "Friends" DROP CONSTRAINT "FK_e80b443c8d4e8ff5cd872ec77f9"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_320fe24a7a562b481c25cea344"`);
            yield queryRunner.query(`DROP INDEX "public"."IDX_e80b443c8d4e8ff5cd872ec77f"`);
            yield queryRunner.query(`DROP TABLE "Friends"`);
            yield queryRunner.query(`DROP TABLE "Users"`);
        });
    }
}
exports.CreateTables1744690154317 = CreateTables1744690154317;
//# sourceMappingURL=1744690154317-CreateTables.js.map