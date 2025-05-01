import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1746112323168 implements MigrationInterface {
    name = 'CreateTables1746112323168'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Snaps" ("id" SERIAL NOT NULL, "filepath" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "isOpened" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP, "caption" character varying, "sender_id" integer, "recipient_id" integer, CONSTRAINT "PK_10565c794f64c945c7949bf4838" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Friends" ("user_id" integer NOT NULL, "friend_id" integer NOT NULL, CONSTRAINT "PK_fbbab4c89ece262e09f1cd83a4e" PRIMARY KEY ("user_id", "friend_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e80b443c8d4e8ff5cd872ec77f" ON "Friends" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_320fe24a7a562b481c25cea344" ON "Friends" ("friend_id") `);
        await queryRunner.query(`ALTER TABLE "Snaps" ADD CONSTRAINT "FK_cb112ac1ebd0e8ebed92bccbad4" FOREIGN KEY ("sender_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Snaps" ADD CONSTRAINT "FK_a08385b088afb3ec7b73f7cfce3" FOREIGN KEY ("recipient_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Friends" ADD CONSTRAINT "FK_e80b443c8d4e8ff5cd872ec77f9" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Friends" ADD CONSTRAINT "FK_320fe24a7a562b481c25cea3442" FOREIGN KEY ("friend_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Friends" DROP CONSTRAINT "FK_320fe24a7a562b481c25cea3442"`);
        await queryRunner.query(`ALTER TABLE "Friends" DROP CONSTRAINT "FK_e80b443c8d4e8ff5cd872ec77f9"`);
        await queryRunner.query(`ALTER TABLE "Snaps" DROP CONSTRAINT "FK_a08385b088afb3ec7b73f7cfce3"`);
        await queryRunner.query(`ALTER TABLE "Snaps" DROP CONSTRAINT "FK_cb112ac1ebd0e8ebed92bccbad4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_320fe24a7a562b481c25cea344"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e80b443c8d4e8ff5cd872ec77f"`);
        await queryRunner.query(`DROP TABLE "Friends"`);
        await queryRunner.query(`DROP TABLE "Snaps"`);
        await queryRunner.query(`DROP TABLE "Users"`);
    }

}
