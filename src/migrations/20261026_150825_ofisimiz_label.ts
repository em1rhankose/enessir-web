import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "counseling_center" ALTER COLUMN "title" SET DEFAULT 'Ofisimiz';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "counseling_center" ALTER COLUMN "title" SET DEFAULT 'Danışma Merkezimiz';`)
}
