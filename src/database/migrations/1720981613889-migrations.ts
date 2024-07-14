import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720981613889 implements MigrationInterface {
    name = 'Migrations1720981613889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`temp_user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(199) NOT NULL, \`tokenExpireAt\` datetime NULL, \`code\` varchar(255) NULL, \`verifiedAt\` datetime NULL, \`verificationExpireAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`ingredient\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`packSize\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`strength\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`costPrice\` double(20,8) NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`sellingPrice\` double(20,8) NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`stock\` int NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`image\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`image\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`stock\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`sellingPrice\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`costPrice\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`strength\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`packSize\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`ingredient\``);
        await queryRunner.query(`DROP TABLE \`temp_user\``);
    }

}
