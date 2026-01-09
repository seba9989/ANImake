import { form, getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { category, series, seriesToCategory } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { redirect } from '@sveltejs/kit';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';
import { DrizzleQueryError } from 'drizzle-orm';

const Props = formScope.type({
	seriesId: createSelectSchema(series).get('id'),
	categories: [createInsertSchema(category).omit('id'), '[]']
});

export const categories = form(Props, async ({ seriesId, categories }) => {
	try {
		await db.insert(category).values(categories).onConflictDoNothing();

		const categoriesId_s = await db.query.category.findMany({
			where: (t, { inArray }) =>
				inArray(
					t.title,
					categories.map(({ title }) => title)
				)
		});

		await db
			.insert(seriesToCategory)
			.values(
				categoriesId_s.map(({ id }): typeof seriesToCategory.$inferInsert => ({
					categoryId: id,
					seriesId: seriesId
				}))
			)
			.onConflictDoNothing();
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			console.log(e.message);
		}
		return;
	}

	const urlArray = getRequestEvent().url.href.split('/');

	urlArray.pop();

	const rUrl = new URL(`${urlArray.join('/')}/relations${getRequestEvent().url.search}`);

	redirect(300, rUrl);
});
