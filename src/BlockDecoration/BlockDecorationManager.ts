import * as vscode from 'vscode';
import DocumentDecoration from '../DecorationManager/DocumentDecoration';
import getWhitespaceCharSize from '../util/getWhitespaceCharSize';
import { BlockDecoration, PendingBlockDecoration } from './BlockDecoration';
import tryGetOverrides from './tryGetOverrides';

export default abstract class BlockDecorationManager extends DocumentDecoration {
	startRegex = /^(\s*).*?@\[(.+?)\]\s*(\[({.+})\])?/;
	endRegex = /^(\s*).*?\[(.+?)\]@/;

	blockDecorations: BlockDecoration[] = [];
	lineDecorations: vscode.TextEditorDecorationType[] = [];

	constructor(editor: vscode.TextEditor) {
		super(editor);
	}

	clear() {
		this.blockDecorations = [];
		this.lineDecorations.forEach((decoration) => {
			decoration.dispose();
		});
		this.lineDecorations = [];
	}

	parseBlocks() {
		const textDocument = this.editor.document;
		const text = textDocument.getText();
		const lines = text.split('\n');
		const pendingDecorations: PendingBlockDecoration[] = [];

		lines.forEach((line, index) => {
			const startMatches = line.match(this.startRegex);

			if (startMatches) {
				const [, whitespace, name, , overrides] = startMatches;

				pendingDecorations.push({
					whitespace,
					name,
					startLine: index,
					overrides,
				});
			} else {
				const endMatches = line.match(this.endRegex);

				if (endMatches) {
					const [, whitespace, name] = endMatches;
					// : getWhitespaceCharSize(whitespace, editor)
					const foundStarter = pendingDecorations.find(
						(pendingDecoration) =>
							pendingDecoration.name === name &&
							pendingDecoration.whitespace === whitespace
					);

					if (foundStarter) {
						const { startLine, whitespace, overrides } =
							foundStarter;
						const endLine = index;

						const whitespaceOffset = getWhitespaceCharSize(
							whitespace,
							this.editor
						);

						// const blockRange = new vscode.Range(
						// 	new vscode.Position(startLine, 0),
						// 	new vscode.Position(endLine, 0)
						// );

						const selected = this.editor.selections.some(
							// (selection) => blockRange.intersection(selection)
							(selection) => {
								if (selection.isSingleLine) {
									return (
										selection.start.line >= startLine &&
										selection.start.line <= endLine &&
										selection.start.character >=
											whitespace.length
									);
								}

								return (
									selection.start.line <= endLine &&
									selection.end.line >= startLine
								);
							}
						);

						this.blockDecorations.push({
							name,
							startLine,
							endLine,

							lines: lines.filter(
								(l, index) =>
									index >= startLine && index <= endLine
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
	}

	abstract createDecorations(): void;

	decorate(): void {
		this.clear();
		this.parseBlocks();

		this.createDecorations();
	}
}
