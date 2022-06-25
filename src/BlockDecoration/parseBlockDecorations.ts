import * as vscode from 'vscode';
import getWhitespaceCharSize from '../util/getWhitespaceCharSize';
import { BlockDecoration, PendingBlockDecoration } from './BlockDecoration';
import tryGetOverrides from './tryGetOverrides';

const startRegex = /^(\s*).*?@\[(.+?)\]\s*(\[({.+})\])?/;
const endRegex = /^(\s*).*?\[(.+?)\]@/;

export default function parseBlockDecorations(
	textDocument: vscode.TextDocument,
	{ tabSize = 2, selections = [] as readonly vscode.Selection[] } = {}
) {
	const text = textDocument.getText();
	const lines = text.split('\n');
	const pendingDecorations: PendingBlockDecoration[] = [];
	const blockDecorations: BlockDecoration[] = [];

	lines.forEach((line, index) => {
		const startMatches = line.match(startRegex);

		if (startMatches) {
			const [, whitespace, name, , overrides] = startMatches;

			pendingDecorations.push({
				whitespace,
				name,
				startLine: index,
				overrides,
			});
		} else {
			const endMatches = line.match(endRegex);

			if (endMatches) {
				const [, whitespace, name] = endMatches;

				const foundStarter = pendingDecorations.find(
					(pendingDecoration) =>
						pendingDecoration.name === name &&
						pendingDecoration.whitespace === whitespace
				);

				if (foundStarter) {
					const { startLine, whitespace, overrides } = foundStarter;
					const endLine = index;

					const selected = selections.some((selection) => {
						if (selection.isSingleLine) {
							return (
								selection.start.line >= startLine &&
								selection.start.line <= endLine &&
								selection.start.character >= whitespace.length
							);
						}

						return (
							selection.start.line <= endLine &&
							selection.end.line >= startLine
						);
					});

					const whitespaceOffset = getWhitespaceCharSize(
						whitespace,
						tabSize
					);

					blockDecorations.push({
						name,
						startLine,
						endLine,

						lines: lines.filter(
							(l, index) => index >= startLine && index <= endLine
						),

						whitespace,
						whitespaceOffset,

						selected,
						overrides: tryGetOverrides(overrides),
					});

					// remove from pending decorations
					pendingDecorations.splice(
						pendingDecorations.indexOf(foundStarter),
						1
					);
				}
			}
		}
	});

	return blockDecorations;
}
