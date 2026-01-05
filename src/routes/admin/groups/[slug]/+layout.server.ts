import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { DrizzleQueryError, eq } from 'drizzle-orm';

export const load = (async ({ params, request }) => {
	try {
		let organization = await db.query.group.findFirst({
			where: eq(db.$schema.group.slug, params.slug),
			with: {
				invitations: true,
				members: {
					with: {
						user: {
							columns: {
								id: true,
								email: true,
								name: true,
								image: true
							}
						}
					}
				}
			}
		});

		if (!organization) error(404, 'Organization not found');

		return { organization };
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			error(404, e.message);
		}
	}

	return {};
}) satisfies LayoutServerLoad;
