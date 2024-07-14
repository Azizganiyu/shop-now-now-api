import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720974584712 implements MigrationInterface {
    name = 'Migrations1720974584712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_sub_category\` CHANGE \`description\` \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_sub_category\` CHANGE \`description\` \`description\` text NOT NULL`);
    }

}
