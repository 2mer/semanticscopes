const spaceRegex = / /g;
const tabRegex = /\t/g;

export default function getWhitespaceCharSize(
	whitespace: string,
	tabSize: number
) {
	const spaces = (whitespace.match(spaceRegex) || []).length;
	const tabs = (whitespace.match(tabRegex) || []).length;

	return spaces + tabs * tabSize;
}
