import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';
import { env } from '$env/dynamic/private';
import { Column, ilike, or, SQL, sql, type SQLWrapper } from 'drizzle-orm';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const db = Object.assign(drizzle(client, { schema }), {
	$schema: schema
});

await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

export const search = (
	column: Column | SQL.Aliased | SQL,
	value: string | SQLWrapper
): SQL | undefined => or(sql`${column} % ${value}`, ilike(column, `%${value}%`));
