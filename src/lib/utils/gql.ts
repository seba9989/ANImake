import { Client, cacheExchange, fetchExchange } from '@urql/core';

const anilist = new Client({
	url: 'https://graphql.anilist.co',
	exchanges: [cacheExchange, fetchExchange],
	preferGetMethod: false
});

export const gql = {
	anilist
};
