import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnDeleteSetNull1767876100000 implements MigrationInterface {
  name = 'AddOnDeleteSetNull1767876100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop existing foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_2b173e901d7562152e490422e79"`,
    );

    // Re-add with ON DELETE SET NULL
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_2b173e901d7562152e490422e79" FOREIGN KEY ("coverletter_id") REFERENCES "coverletter"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the SET NULL constraints
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_2b173e901d7562152e490422e79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21"`,
    );

    // Re-add with NO ACTION (original behavior)
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_2b173e901d7562152e490422e79" FOREIGN KEY ("coverletter_id") REFERENCES "coverletter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
