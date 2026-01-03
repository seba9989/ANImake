import { type } from 'arktype';

// Definicje pomocniczych typów
const ImageDimensions = type({
	width: 'number',
	height: 'number'
});

const ImageMeta = type({
	dimensions: {
		'tiny?': ImageDimensions,
		'large?': ImageDimensions,
		'small?': ImageDimensions,
		'medium?': ImageDimensions
	}
});

const PosterImage = type({
	tiny: 'string',
	large: 'string',
	small: 'string',
	medium: 'string',
	original: 'string',
	meta: ImageMeta
});

const CoverImage = type({
	tiny: 'string',
	large: 'string',
	small: 'string',
	original: 'string',
	meta: ImageMeta
});

const Titles = type({
	'en?': 'string',
	en_jp: 'string',
	'en_us?': 'string',
	'ja_jp?': 'string'
});

const RatingFrequencies = type({
	'2?': 'string',
	'3?': 'string',
	'4?': 'string',
	'5?': 'string',
	'6?': 'string',
	'7?': 'string',
	'8?': 'string',
	'9?': 'string',
	'10?': 'string',
	'11?': 'string',
	'12?': 'string',
	'13?': 'string',
	'14?': 'string',
	'15?': 'string',
	'16?': 'string',
	'17?': 'string',
	'18?': 'string',
	'19?': 'string',
	'20?': 'string'
});

const RelationshipLink = type({
	self: 'string',
	related: 'string'
});

const RelationshipData = type({
	type: 'string',
	id: 'string'
});

const Relationship = type({
	links: RelationshipLink,
	'data?': RelationshipData
});

const AnimeRelationships = type({
	genres: Relationship,
	categories: Relationship,
	'castings?': Relationship,
	'installments?': Relationship,
	'mappings?': Relationship,
	'reviews?': Relationship,
	'mediaRelationships?': Relationship,
	'characters?': Relationship,
	'staff?': Relationship,
	'productions?': Relationship,
	'quotes?': Relationship,
	'episodes?': Relationship,
	'streamingLinks?': Relationship,
	'animeProductions?': Relationship,
	'animeCharacters?': Relationship,
	'animeStaff?': Relationship
});

const AnimeAttributes = type({
	createdAt: 'string',
	updatedAt: 'string',
	slug: 'string',
	synopsis: 'string',
	description: 'string',
	coverImageTopOffset: 'number',
	titles: Titles,
	canonicalTitle: 'string',
	abbreviatedTitles: 'string[]',
	'averageRating?': 'string | null',
	ratingFrequencies: RatingFrequencies,
	userCount: 'number',
	favoritesCount: 'number',
	startDate: 'string',
	'endDate?': 'string | null',
	nextRelease: 'null|string',
	popularityRank: 'number',
	'ratingRank?': 'number | null',
	ageRating: 'string',
	'ageRatingGuide?': 'string | null',
	subtype: 'string',
	status: 'string',
	'tba?': 'string | null',
	posterImage: PosterImage,
	'coverImage?': [CoverImage, '|', 'null'],
	'episodeCount?': 'number | null',
	'episodeLength?': 'number | null',
	totalLength: 'number',
	'youtubeVideoId?': 'string | null',
	showType: type('string').pipe.try(
		(str) => str.toLowerCase(),
		type('"ona" | "ova" | "tv" | "movie" | "music" | "special"')
	),
	nsfw: 'boolean'
});

const Anime = type({
	id: 'string',
	type: "'anime'",
	links: {
		self: 'string'
	},
	attributes: AnimeAttributes,
	relationships: AnimeRelationships
});

const MappingAttributes = type({
	createdAt: 'string',
	updatedAt: 'string',
	externalSite: 'string',
	externalId: 'string'
});

const MappingRelationships = type({
	item: {
		links: RelationshipLink,
		data: RelationshipData
	}
});

const Mapping = type({
	id: 'string',
	type: "'mappings'",
	links: {
		self: 'string'
	},
	attributes: MappingAttributes,
	relationships: MappingRelationships
});

const Meta = type({
	count: 'number'
});

const Links = type({
	first: 'string',
	last: 'string'
});

// Główny typ odpowiedzi API
export const KitsuMappingResponse = type({
	data: [Mapping, '[]'],
	included: [Anime, '[]'],
	meta: Meta,
	links: Links
});

export const MediaSchema = type({
	seasonYear: 'number',
	season: type('string').pipe.try(
		(str) => str.toLowerCase(),
		type("'spring' | 'summer' | 'fall' | 'winter'")
	),
	trailer: [
		type({
			site: 'string',
			id: 'string'
		}).pipe(({ site, id }) =>
			site === 'youtube' ? `https://www.youtube.com/watch?v=${id}` : null
		),

		'|',
		'null'
	]
});
