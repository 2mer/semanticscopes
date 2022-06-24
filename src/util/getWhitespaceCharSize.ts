import * as vscode from 'vscode';

const spaceRegex = / /g;
const tabRegex = /\t/g;

export default function getWhitespaceCharSize(
	whitespace: string,
	editor: vscode.TextEditor
) {
	const spaces = (whitespace.match(spaceRegex) || []).length;
	const tabs = (whitespace.match(tabRegex) || []).length;

	let tabSize = editor.options.tabSize;
	if (typeof tabSize !== 'number') {
		tabSize = 2;
	}

	return spaces + tabs * tabSize;
}
