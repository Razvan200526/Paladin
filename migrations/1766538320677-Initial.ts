import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1766538320677 implements MigrationInterface {
  name = 'Initial1766538320677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "random_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_df2ad7bddf95fc5b7011aa61f29" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "random_entity"`);
  }
}
