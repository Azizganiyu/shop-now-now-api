import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720253101789 implements MigrationInterface {
    name = 'Migrations1720253101789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`code\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`code\` varchar(6) NULL`);
    }

}
