import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1767780233486 implements MigrationInterface {
  name = 'Initial1767780233486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "resume_builders" ("id" character varying(15) NOT NULL, "name" character varying(255) NOT NULL, "templateId" character varying(50) NOT NULL DEFAULT 'classic', "data" jsonb NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'draft', "thumbnailUrl" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(15), CONSTRAINT "PK_065eeaaba6c6f4745a1788079a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "resume_builders" ADD CONSTRAINT "FK_b3a5d7f90b29d49103f55538e57" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "resume_builders" DROP CONSTRAINT "FK_b3a5d7f90b29d49103f55538e57"`,
    );
    await queryRunner.query(`DROP TABLE "resume_builders"`);
  }
}
