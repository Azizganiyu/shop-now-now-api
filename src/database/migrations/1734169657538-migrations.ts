import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734169657538 implements MigrationInterface {
    name = 'Migrations1734169657538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`image\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`image\` varchar(255) NULL`);
    }

}
