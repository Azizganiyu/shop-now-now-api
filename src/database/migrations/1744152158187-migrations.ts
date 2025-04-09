import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744152158187 implements MigrationInterface {
    name = 'Migrations1744152158187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`stock\` \`stock\` int NULL DEFAULT '1000000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` CHANGE \`stock\` \`stock\` int NULL DEFAULT '1'`);
    }

}
