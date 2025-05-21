import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747732889880 implements MigrationInterface {
    name = 'Migrations1747732889880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`app_config\` ADD \`deliveryExcludedWeek\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`app_config\` ADD \`deliveryExcludedDates\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`app_config\` DROP COLUMN \`deliveryExcludedDates\``);
        await queryRunner.query(`ALTER TABLE \`app_config\` DROP COLUMN \`deliveryExcludedWeek\``);
    }

}
