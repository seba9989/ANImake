const unicodeMap = new Map([
	['~q', '?'],
	['~e', '!'],
	['~a', '&'],
	['~eq', '='],
	['~s', '/'],
	['~p', '%'],
	['~u', '_'],
	['_', ' ']
]);

function encodeUrl(url: string): string {
	let encodedUrl = url;
	unicodeMap.entries().forEach(([replacement, char]) => {
		encodedUrl = encodedUrl.split(char).join(replacement);
	});
	return encodedUrl;
}

function decodeUrl(encodedUrl: string): string {
	let decodedUrl = encodedUrl;
	unicodeMap.entries().forEach(([char, replacement]) => {
		decodedUrl = decodedUrl.split(char).join(replacement);
	});

	return decodedUrl;
}

export const url = {
	encode: encodeUrl,
	decode: decodeUrl,
	unicodeMap
};
