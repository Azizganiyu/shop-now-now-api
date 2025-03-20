import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742466078103 implements MigrationInterface {
    name = 'Migrations1742466078103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`device_token\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NULL, \`token\` varchar(255) NOT NULL, \`deviceId\` varchar(255) NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`device_token\` ADD CONSTRAINT \`FK_ba0cbbc3097f061e197e71c112e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_token\` DROP FOREIGN KEY \`FK_ba0cbbc3097f061e197e71c112e\``);
        await queryRunner.query(`DROP TABLE \`device_token\``);
    }

}
