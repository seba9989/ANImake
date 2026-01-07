import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { series } from '.';
import { relations } from 'drizzle-orm';

export const category = pgTable('category', {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	slug: text().notNull()
});

export const category_Relations = relations(category, ({ many }) => ({
	seriesToCategory_s: many(seriesToCategory)
}));

export const seriesToCategory = pgTable('series_to_category', {
	categoryId: uuid()
		.references(() => category.id, { onUpdate: 'cascade' })
		.notNull(),
	seriesId: uuid().references(() => series.id, { onUpdate: 'cascade' })
});

export const seriesToCategory_Relations = relations(seriesToCategory, ({ one }) => ({
	category: one(category, {
		fields: [seriesToCategory.categoryId],
		references: [category.id]
	}),
	series: one(series, {
		fields: [seriesToCategory.seriesId],
		references: [series.id]
	})
}));
