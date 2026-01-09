import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1767951831691 implements MigrationInterface {
  name = 'Initial1767951831691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "coverletter" ("id" character varying(15) NOT NULL, "name" character varying NOT NULL, "filename" character varying NOT NULL, "url" text NOT NULL, "filetype" character varying, "filesize" integer, "state" character varying NOT NULL DEFAULT 'processing', "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(15), CONSTRAINT "PK_8bb7707cd11d03a7595b47992b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "resumes" ("id" character varying(15) NOT NULL, "name" character varying NOT NULL, "filename" character varying NOT NULL, "url" text NOT NULL, "filetype" character varying, "filesize" integer, "state" character varying NOT NULL DEFAULT 'processing', "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(15), CONSTRAINT "PK_9c8677802096d6baece48429d2e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."applications_platform_enum" AS ENUM('Linkedin', 'Glassdoor', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."applications_status_enum" AS ENUM('Applied', 'Interviewing', 'Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" character varying(15) NOT NULL, "employer" character varying NOT NULL, "job_title" character varying NOT NULL, "job_url" character varying, "salary_range" character varying, "currency" character varying(3) NOT NULL DEFAULT 'EUR', "contact" character varying, "location" character varying NOT NULL, "platform" "public"."applications_platform_enum" NOT NULL DEFAULT 'Other', "status" "public"."applications_status_enum" NOT NULL DEFAULT 'Applied', "comments" text array NOT NULL DEFAULT '{}', "suggestions" text array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "locked_at" TIMESTAMP WITH TIME ZONE, "blocked_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying(15) NOT NULL, "resume_id" character varying(15), "coverletter_id" character varying(15), CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."chat_sessions_resource_type_enum" AS ENUM('resume', 'coverletter')`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_sessions" ("id" character varying(15) NOT NULL, "resource_type" "public"."chat_sessions_resource_type_enum" NOT NULL, "resource_id" character varying(15) NOT NULL, "resource_name" character varying(255) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" character varying(15), CONSTRAINT "PK_efc151a4aafa9a28b73dedc485f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."chat_messages_sender_enum" AS ENUM('user', 'ai')`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" character varying(15) NOT NULL, "content" text NOT NULL, "sender" "public"."chat_messages_sender_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "chat_session_id" character varying(15), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_listings_source_enum" AS ENUM('linkedin', 'indeed', 'glassdoor', 'manual', 'other')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_listings_job_type_enum" AS ENUM('full-time', 'part-time', 'contract', 'internship', 'remote')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_listings_experience_level_enum" AS ENUM('entry', 'mid', 'senior', 'lead', 'executive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "job_listings" ("id" character varying(15) NOT NULL, "external_id" character varying, "source" "public"."job_listings_source_enum" NOT NULL DEFAULT 'other', "title" character varying(255) NOT NULL, "company" character varying(255) NOT NULL, "company_logo" text, "location" character varying(255) NOT NULL, "is_remote" boolean NOT NULL DEFAULT false, "description" text NOT NULL, "description_html" text, "job_type" "public"."job_listings_job_type_enum" NOT NULL DEFAULT 'full-time', "experience_level" "public"."job_listings_experience_level_enum", "salary_min" integer, "salary_max" integer, "salary_currency" character varying(3) NOT NULL DEFAULT 'USD', "url" text NOT NULL, "apply_url" text, "required_skills" text array NOT NULL DEFAULT '{}', "preferred_skills" text array NOT NULL DEFAULT '{}', "keywords" text array NOT NULL DEFAULT '{}', "embedding" jsonb, "years_experience_min" integer, "years_experience_max" integer, "education_requirement" character varying, "benefits" text array NOT NULL DEFAULT '{}', "is_active" boolean NOT NULL DEFAULT true, "expires_at" TIMESTAMP WITH TIME ZONE, "posted_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_ce5adead49e5fbf2df55e1917c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_089ecd7fd52c0e67e97cb3280c" ON "job_listings" ("expires_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c7e362476665fd5ba4e26cbfde" ON "job_listings" ("created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54bf31530f4f8325b728e279ff" ON "job_listings" ("location") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fcb966f0fa2d499b8de016f14a" ON "job_listings" ("source", "external_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."job_matches_status_enum" AS ENUM('new', 'viewed', 'saved', 'applied', 'dismissed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "job_matches" ("id" character varying(15) NOT NULL, "compatibility_score" numeric(5,2) NOT NULL, "skills_score" numeric(5,2) NOT NULL DEFAULT '0', "experience_score" numeric(5,2) NOT NULL DEFAULT '0', "education_score" numeric(5,2) NOT NULL DEFAULT '0', "keywords_score" numeric(5,2) NOT NULL DEFAULT '0', "semantic_score" numeric(5,2) NOT NULL DEFAULT '0', "matched_skills" text array NOT NULL DEFAULT '{}', "missing_skills" text array NOT NULL DEFAULT '{}', "matched_keywords" text array NOT NULL DEFAULT '{}', "missing_keywords" text array NOT NULL DEFAULT '{}', "improvement_suggestions" text array NOT NULL DEFAULT '{}', "status" "public"."job_matches_status_enum" NOT NULL DEFAULT 'new', "is_notified" boolean NOT NULL DEFAULT false, "viewed_at" TIMESTAMP WITH TIME ZONE, "saved_at" TIMESTAMP WITH TIME ZONE, "applied_at" TIMESTAMP WITH TIME ZONE, "dismissed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" character varying(15) NOT NULL, "job_id" character varying(15) NOT NULL, "resume_id" character varying(15), CONSTRAINT "PK_ff1cc5ef34826840839cce74198" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('application_status_change', 'application_reminder', 'interview_scheduled', 'interview_reminder', 'resume_analyzed', 'coverletter_analyzed', 'system', 'achievement')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_priority_enum" AS ENUM('low', 'normal', 'high', 'urgent')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" character varying(15) NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "priority" "public"."notifications_priority_enum" NOT NULL DEFAULT 'normal', "read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP WITH TIME ZONE, "action_url" character varying, "action_label" character varying, "resource_type" character varying, "resource_id" character varying(15), "metadata" jsonb, "expires_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" character varying(15) NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_310667f935698fcd8cb319113a" ON "notifications" ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a17edcb3b8e39c52a7d0554d31" ON "notifications" ("user_id", "read") `,
    );
    await queryRunner.query(
      `CREATE TABLE "resume_builders" ("id" character varying(15) NOT NULL, "name" character varying(255) NOT NULL, "templateId" character varying(50) NOT NULL DEFAULT 'classic', "data" jsonb NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'draft', "thumbnailUrl" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying(15), CONSTRAINT "PK_065eeaaba6c6f4745a1788079a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" character varying(15) NOT NULL, "email" character varying(255) NOT NULL, "name" character varying(200) NOT NULL, "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "bio" text, "profession" character varying(100) NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "image" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "locked_at" TIMESTAMP WITH TIME ZONE, "blocked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_accounts" ("id" character varying(15) NOT NULL, "provider_id" character varying(50) NOT NULL, "account_id" character varying(255) NOT NULL, "password" character varying(255), "refresh_token" text, "expires_at" TIMESTAMP WITH TIME ZONE, "scope" text, "id_token" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying(15), CONSTRAINT "REL_6711686e2dc4fcf9c7c83b8373" UNIQUE ("user_id"), CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_job_preferences" ("id" character varying(15) NOT NULL, "desired_titles" text array NOT NULL DEFAULT '{}', "desired_locations" text array NOT NULL DEFAULT '{}', "is_remote_preferred" boolean NOT NULL DEFAULT false, "is_hybrid_ok" boolean NOT NULL DEFAULT true, "is_onsite_ok" boolean NOT NULL DEFAULT true, "min_salary" integer, "max_salary" integer, "salary_currency" character varying(3) NOT NULL DEFAULT 'USD', "job_types" text array NOT NULL DEFAULT '{full-time}', "experience_levels" text array NOT NULL DEFAULT '{}', "preferred_industries" text array NOT NULL DEFAULT '{}', "excluded_industries" text array NOT NULL DEFAULT '{}', "preferred_companies" text array NOT NULL DEFAULT '{}', "excluded_companies" text array NOT NULL DEFAULT '{}', "skills" text array NOT NULL DEFAULT '{}', "notify_high_matches" boolean NOT NULL DEFAULT true, "notify_threshold" integer NOT NULL DEFAULT '70', "notify_frequency" character varying NOT NULL DEFAULT 'daily', "active_resume_id" character varying(15), "resume_skills" text array NOT NULL DEFAULT '{}', "resume_keywords" text array NOT NULL DEFAULT '{}', "resume_embedding" jsonb, "years_experience" integer, "education_level" character varying, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" character varying(15) NOT NULL, CONSTRAINT "REL_bc63eb1bec34a4a7491163bde5" UNIQUE ("user_id"), CONSTRAINT "PK_faaa655d4cc4b0ddb813ebe4741" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_sessions" ("id" character varying NOT NULL, "token" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ip_address" character varying(45), "user_agent" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying(15), CONSTRAINT "UQ_ff5db00dec0f61218cd0d468df0" UNIQUE ("token"), CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_verifications" ("id" character varying(15) NOT NULL, "identifier" character varying(255) NOT NULL, "value" character varying(255) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" character varying(15), CONSTRAINT "PK_3269a92433d028916ab342b94fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "coverletter" ADD CONSTRAINT "FK_c958de978daf8532926c407a02f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resumes" ADD CONSTRAINT "FK_dce6e1ce26d348e602f56fa6363" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_2b173e901d7562152e490422e79" FOREIGN KEY ("coverletter_id") REFERENCES "coverletter"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" ADD CONSTRAINT "FK_1fa209cf48ae975a109366542a5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_7737b2da509d8769d559f354c7e" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" ADD CONSTRAINT "FK_a93299e10383196fee7cce8d04a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" ADD CONSTRAINT "FK_7045a1ca79ebf670855006f1567" FOREIGN KEY ("job_id") REFERENCES "job_listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" ADD CONSTRAINT "FK_1e6e3645d57839fac6ee7504035" FOREIGN KEY ("resume_id") REFERENCES "resumes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resume_builders" ADD CONSTRAINT "FK_b3a5d7f90b29d49103f55538e57" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" ADD CONSTRAINT "FK_6711686e2dc4fcf9c7c83b83735" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job_preferences" ADD CONSTRAINT "FK_bc63eb1bec34a4a7491163bde5b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_verifications" ADD CONSTRAINT "FK_2c6a037273f1cb3e6fdd832db24" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_verifications" DROP CONSTRAINT "FK_2c6a037273f1cb3e6fdd832db24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_job_preferences" DROP CONSTRAINT "FK_bc63eb1bec34a4a7491163bde5b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_accounts" DROP CONSTRAINT "FK_6711686e2dc4fcf9c7c83b83735"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resume_builders" DROP CONSTRAINT "FK_b3a5d7f90b29d49103f55538e57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" DROP CONSTRAINT "FK_1e6e3645d57839fac6ee7504035"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" DROP CONSTRAINT "FK_7045a1ca79ebf670855006f1567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_matches" DROP CONSTRAINT "FK_a93299e10383196fee7cce8d04a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_7737b2da509d8769d559f354c7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_sessions" DROP CONSTRAINT "FK_1fa209cf48ae975a109366542a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_2b173e901d7562152e490422e79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_241f549e92b54bb3538c9bdcf21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_9e7594d5b474d9cbebba15c1ae7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resumes" DROP CONSTRAINT "FK_dce6e1ce26d348e602f56fa6363"`,
    );
    await queryRunner.query(
      `ALTER TABLE "coverletter" DROP CONSTRAINT "FK_c958de978daf8532926c407a02f"`,
    );
    await queryRunner.query(`DROP TABLE "user_verifications"`);
    await queryRunner.query(`DROP TABLE "user_sessions"`);
    await queryRunner.query(`DROP TABLE "user_job_preferences"`);
    await queryRunner.query(`DROP TABLE "user_accounts"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "resume_builders"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a17edcb3b8e39c52a7d0554d31"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_310667f935698fcd8cb319113a"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "job_matches"`);
    await queryRunner.query(`DROP TYPE "public"."job_matches_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fcb966f0fa2d499b8de016f14a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54bf31530f4f8325b728e279ff"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c7e362476665fd5ba4e26cbfde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_089ecd7fd52c0e67e97cb3280c"`,
    );
    await queryRunner.query(`DROP TABLE "job_listings"`);
    await queryRunner.query(
      `DROP TYPE "public"."job_listings_experience_level_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."job_listings_job_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."job_listings_source_enum"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TYPE "public"."chat_messages_sender_enum"`);
    await queryRunner.query(`DROP TABLE "chat_sessions"`);
    await queryRunner.query(
      `DROP TYPE "public"."chat_sessions_resource_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."applications_platform_enum"`);
    await queryRunner.query(`DROP TABLE "resumes"`);
    await queryRunner.query(`DROP TABLE "coverletter"`);
  }
}
