import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1720213734307 implements MigrationInterface {
    name = 'Migrations1720213734307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activity\` (\`id\` varchar(36) NOT NULL, \`event\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`ipAddress\` varchar(255) NULL, \`userId\` varchar(255) NULL, \`object\` text NULL, \`objectId\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ssions\` (\`id\` varchar(36) NOT NULL, \`token\` text NOT NULL, \`clientType\` varchar(199) NULL, \`clientName\` varchar(199) NULL, \`clientVersion\` varchar(199) NULL, \`osName\` varchar(199) NULL, \`osVersion\` varchar(199) NULL, \`deviceType\` varchar(199) NULL, \`deviceBrand\` varchar(199) NULL, \`expiresAt\` datetime NOT NULL, \`userId\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_read_receipt\` (\`id\` varchar(36) NOT NULL, \`notificationId\` varchar(255) NULL, \`userId\` varchar(255) NULL, \`readAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(199) NOT NULL, \`tag\` varchar(199) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`firstName\` varchar(199) NULL, \`lastName\` varchar(199) NULL, \`username\` varchar(199) NULL, \`email\` varchar(199) NOT NULL, \`phone\` varchar(199) NULL, \`password\` varchar(199) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`tokenExpireAt\` datetime NULL, \`code\` varchar(6) NULL, \`twoFactorAuthenticationSecret\` text NULL, \`loginAttempt\` int NULL DEFAULT '0', \`loginRetryTime\` datetime NULL, \`verifiedAt\` datetime NULL, \`twoFactorAuthentication\` tinyint NOT NULL DEFAULT 0, \`reference\` varchar(255) NULL, \`roleId\` varchar(255) NULL DEFAULT '3', \`status\` varchar(255) NOT NULL DEFAULT 'active', \`isDeleted\` tinyint NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`message\` longtext NOT NULL, \`userId\` varchar(255) NULL, \`userShared\` tinyint NOT NULL DEFAULT 0, \`channels\` varchar(255) NULL DEFAULT '[]', \`emailSent\` tinyint NULL DEFAULT 0, \`pushSent\` tinyint NULL DEFAULT 0, \`websocketSent\` tinyint NULL DEFAULT 0, \`localSent\` tinyint NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`log\` (\`id\` varchar(36) NOT NULL, \`message\` longtext NOT NULL, \`type\` varchar(255) NULL DEFAULT 'debug', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_log\` (\`id\` varchar(36) NOT NULL, \`type\` varchar(255) NOT NULL, \`path\` varchar(255) NULL, \`payload\` text NULL, \`message\` text NULL, \`response\` longtext NULL, \`ipAddress\` varchar(255) NULL, \`accessType\` varchar(255) NULL, \`accessId\` varchar(255) NULL, \`email\` varchar(255) NULL, \`status\` tinyint NULL DEFAULT 1, \`otherInfo\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`activity\` ADD CONSTRAINT \`FK_3571467bcbe021f66e2bdce96ea\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ssions\` ADD CONSTRAINT \`FK_a3aadbd81a3884f3a1a3180412c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read_receipt\` ADD CONSTRAINT \`FK_3a55781e84d69f102f7941a9b7d\` FOREIGN KEY (\`notificationId\`) REFERENCES \`notification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification_read_receipt\` ADD CONSTRAINT \`FK_53f680ba02d5df0c0915eafe1e0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`notification_read_receipt\` DROP FOREIGN KEY \`FK_53f680ba02d5df0c0915eafe1e0\``);
        await queryRunner.query(`ALTER TABLE \`notification_read_receipt\` DROP FOREIGN KEY \`FK_3a55781e84d69f102f7941a9b7d\``);
        await queryRunner.query(`ALTER TABLE \`ssions\` DROP FOREIGN KEY \`FK_a3aadbd81a3884f3a1a3180412c\``);
        await queryRunner.query(`ALTER TABLE \`activity\` DROP FOREIGN KEY \`FK_3571467bcbe021f66e2bdce96ea\``);
        await queryRunner.query(`DROP TABLE \`api_log\``);
        await queryRunner.query(`DROP TABLE \`log\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`notification_read_receipt\``);
        await queryRunner.query(`DROP TABLE \`ssions\``);
        await queryRunner.query(`DROP TABLE \`activity\``);
    }

}
