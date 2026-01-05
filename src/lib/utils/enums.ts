import type {
	content_Enum,
	legacyPlayerType_Enum,
	seriesRelationType_Enum,
	seriesSeason_Enum,
	seriesStatus_Enum,
	seriesType_Enum
} from '$lib/server/db/schema';
import type { PgEnum } from 'drizzle-orm/pg-core';
type PgEnumToMap<T extends PgEnum<any>> = Map<T['enumValues'][number], string>;

export const contentEnum: PgEnumToMap<typeof content_Enum> = new Map([
	['subtitles', 'Napisy'],
	['lector', 'Lector']
]);

export const seriesTypeEnum: PgEnumToMap<typeof seriesType_Enum> = new Map([
	['ona', 'ONA'],
	['ova', 'OVA'],
	['tv', 'TV'],
	['movie', 'Film'],
	['music', 'Musical'],
	['special', 'Special']
]);

export const seriesSeasonEnum: PgEnumToMap<typeof seriesSeason_Enum> = new Map([
	['spring', 'Wiosna'],
	['summer', 'Lato'],
	['fall', 'Jesień'],
	['winter', 'Zima']
]);

export const seriesRelationTypeEnum: PgEnumToMap<typeof seriesRelationType_Enum> = new Map([
	['prequel', 'Prequel'],
	['sequel', 'Sequel'],
	['parent', 'Główna seria'],
	['side_story', 'Historia poboczna'],
	['summary', 'Streszczenie'],
	['alternative', 'Wersja alternatywna'],
	['spin_off', 'SpinOff'],
	['other', 'Inne']
]);

export const seriesStatusEnum: PgEnumToMap<typeof seriesStatus_Enum> = new Map([
	['airing', 'Wydawana'],
	['finished', 'Ukończona'],
	['not_yet_aired', 'Czeka na wydanie'],
	['cancelled', 'Usunięta'],
	['banned', 'Zbanowana']
]);

export const legacyPlayerTypeEnum: PgEnumToMap<typeof legacyPlayerType_Enum> = new Map([
	['video', 'Video'],
	['download', 'Pobierz']
]);
