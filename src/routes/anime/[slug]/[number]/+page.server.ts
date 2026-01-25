import { regex, type } from 'arktype';
import type { PageServerLoad } from './$types';
import { createSelectSchema } from 'drizzle-arktype';
import {
	episode,
	episodeToGroup,
	group,
	groupToSource,
	legacyPlayer,
	player,
	series,
	source
} from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { db, sortTextAsNumber } from '$lib/server/db';
import { and, desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { url as urlParser } from '$lib/utils/url';

const searchParamsSchema = type({
	group: createSelectSchema(group).get('slug')
});

const createUrl = (
	url: URL,
	array: {
		number: string;
	}[]
) => {
	if (array.length === 0) return undefined;

	const episodeNumberReg = regex('^(?<base>(/\\w+)+/)(?<number>\\d+)$');
	const basePath = episodeNumberReg.exec(url.pathname)?.groups.base;

	return `${basePath}${array[0].number}${url.search}`;
};

export const load = (async ({ url, params, parent }) => {
	const { seriesData } = await parent();
	const searchParams = searchParamsSchema(Object.fromEntries(url.searchParams.entries()));

	if (searchParams instanceof type.errors) {
		// Zamienić na wybór grupy
		error(404, 'Nie podano grupy.');
	}

	const episodesInGroup = await db
		.select(getTableColumns(episode))
		.from(episode)
		.innerJoin(series, eq(episode.seriesId, series.id))
		.innerJoin(episodeToGroup, eq(episodeToGroup.episodeId, episode.id))
		.innerJoin(group, eq(episodeToGroup.groupId, group.id))
		.where(and(eq(series.title, urlParser.decode(params.slug)), eq(group.slug, searchParams.group)))
		.orderBy(...sortTextAsNumber(episode.number));

	const previous = await db
		.select({ number: episode.number })
		.from(episode)
		.innerJoin(episodeToGroup, eq(episodeToGroup.episodeId, episode.id))
		.innerJoin(group, eq(episodeToGroup.groupId, group.id))
		.where(
			and(
				eq(episode.seriesId, seriesData.id),
				eq(group.slug, searchParams.group),
				sql`CAST(REGEXP_REPLACE(${episode.number}, '[^0-9]', '', 'g') AS INTEGER) < ${params.number}`
			)
		)
		.orderBy(
			desc(sql`CAST(REGEXP_REPLACE(${episode.number}, '[^0-9]', '', 'g') AS INTEGER)`),
			desc(episode.number)
		)
		.limit(1);

	const next = await db
		.select({ number: episode.number })
		.from(episode)
		.innerJoin(episodeToGroup, eq(episodeToGroup.episodeId, episode.id))
		.innerJoin(group, eq(episodeToGroup.groupId, group.id))
		.where(
			and(
				eq(episode.seriesId, seriesData.id),
				eq(group.slug, searchParams.group),
				sql`CAST(REGEXP_REPLACE(${episode.number}, '[^0-9]', '', 'g') AS INTEGER) > ${params.number}`
			)
		)
		.orderBy(
			sql`CAST(REGEXP_REPLACE(${episode.number}, '[^0-9]', '', 'g') AS INTEGER)`,
			episode.number
		)
		.limit(1);

	const player_s = await db
		.select(getTableColumns(player))
		.from(player)
		.innerJoin(source, eq(player.sourceId, source.id))
		.innerJoin(episode, eq(source.episodeId, episode.id))
		.innerJoin(series, eq(episode.seriesId, series.id))
		.innerJoin(groupToSource, eq(groupToSource.sourceId, source.id))
		.innerJoin(group, eq(groupToSource.groupId, group.id))
		.where(
			and(
				eq(series.title, urlParser.decode(params.slug)),
				eq(episode.number, params.number),
				eq(group.slug, searchParams.group)
			)
		)
		.limit(1);

	const legacyPlayer_s = await db
		.select(getTableColumns(legacyPlayer))
		.from(legacyPlayer)
		.innerJoin(source, eq(legacyPlayer.sourceId, source.id))
		.innerJoin(episode, eq(source.episodeId, episode.id))
		.innerJoin(series, eq(episode.seriesId, series.id))
		.innerJoin(groupToSource, eq(groupToSource.sourceId, source.id))
		.innerJoin(group, eq(groupToSource.groupId, group.id))
		.where(
			and(
				eq(series.title, urlParser.decode(params.slug)),
				eq(episode.number, params.number),
				eq(group.slug, searchParams.group)
			)
		);

	return {
		player: player_s.at(0),
		legacyPlayer_s,
		episodesInGroup,
		previous: createUrl(url, previous),
		next: createUrl(url, next)
	};
}) satisfies PageServerLoad;
