import { pgEnum } from 'drizzle-orm/pg-core';

export const content_Enum = pgEnum('content', ['subtitles', 'lector']);

export const seriesType_Enum = pgEnum('series_type', [
	'ona',
	'ova',
	'tv',
	'movie',
	'music',
	'special'
]);

export const seriesSeason_Enum = pgEnum('series_season', ['spring', 'summer', 'fall', 'winter']);

export const seriesRelationType_Enum = pgEnum('series_relation_type', [
	'prequel',
	'sequel',
	'parent',
	'side_story',
	'summary',
	'alternative',
	'spin_off',
	'other'
]);

export const seriesStatus_Enum = pgEnum('series_status', [
	'airing',
	'finished',
	'not_yet_aired',
	'cancelled',
	'banned'
]);

export const legacyPlayerType_Enum = pgEnum('legacy_player_type', ['video', 'download']);

export const memberRole_Enum = pgEnum('member_role', ['owner', 'admin', 'member']);
