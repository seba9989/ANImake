import { form } from '$app/server';
import { db } from '$lib/server/db';
import { series, category, seriesToCategory, seriesRelation } from '$lib/server/db/schema';
import { formScope } from '$lib/utils/typst';
import { invalid, redirect } from '@sveltejs/kit';
import { type } from 'arktype';
import { createInsertSchema, createSelectSchema } from 'drizzle-arktype';
import { DrizzleQueryError } from 'drizzle-orm';

const Props = formScope.type({
	seriesData: createInsertSchema(series, {
		coverUrl: formScope.type('string.url'),

		bannerUrl: formScope.type('string.url.optional'),
		trailerUrl: formScope.type('string.url.optional'),

		kitsuId: formScope.type('string.numeric.parse'),
		description: formScope.type('string.optional'),
		aired: type('string.date.parse'),
		nsfw: (schema) => schema.optional(),
		releaseYear: type('string.numeric.parse')
	})
		.omit('id', 'updateAt')
		.pipe(({ nsfw, ...obj }) => ({ ...obj, nsfw: !!nsfw })),

	categories: [createInsertSchema(category).omit('id'), '[]']
});

export const create = form(Props, async ({ categories, seriesData }, issue) => {
	let seriesBD: (typeof series.$inferSelect)[];
	try {
		seriesBD = await db.insert(series).values(seriesData).onConflictDoNothing().returning();
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			console.log(e);
		}
		return;
	}

	if (seriesBD.length == 0) {
		invalid(issue.seriesData('Seria już istnieje'));
	}

	try {
		await db.insert(category).values(categories).onConflictDoNothing();

		const categoriesId_s = await db.query.category.findMany({
			where: (t, { inArray }) =>
				inArray(
					t.title,
					categories.map(({ title }) => title)
				)
		});

		await db.insert(seriesToCategory).values(
			categoriesId_s.map(({ id }): typeof seriesToCategory.$inferInsert => ({
				categoryId: id,
				seriesId: seriesBD[0].id
			}))
		);
	} catch (e) {
		if (e instanceof DrizzleQueryError) {
			console.log(e.message);
		}
		return;
	}

	redirect(300, '/admin/series');
});
