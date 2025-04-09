import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744154219606 implements MigrationInterface {
    name = 'Migrations1744154219606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lga\` ADD \`cities\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_shipment\` ADD \`houseAddress\` varchar(199) NULL`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD \`houseAddress\` varchar(199) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address\` DROP COLUMN \`houseAddress\``);
        await queryRunner.query(`ALTER TABLE \`order_shipment\` DROP COLUMN \`houseAddress\``);
        await queryRunner.query(`ALTER TABLE \`lga\` DROP COLUMN \`cities\``);
    }

}
