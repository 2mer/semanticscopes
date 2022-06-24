import * as vscode from 'vscode';
import BlockDecorationManager from '../../BlockDecoration/BlockDecorationManager';
import decorationGenerators from './decorationGenerators';

export default class CodeblockDecoration extends BlockDecorationManager {
	createDecorations() {
		this.blockDecorations.forEach((blockDecoration) => {
			// start line decorations
			const startDecoration = decorationGenerators.start(blockDecoration);

			this.editor.setDecorations(startDecoration, [
				new vscode.Range(
					new vscode.Position(blockDecoration.startLine, 0),
					new vscode.Position(blockDecoration.startLine, 0)
				),
			]);
			this.lineDecorations.push(startDecoration);

			// end line decorations
			const endDecoration = decorationGenerators.end(blockDecoration);

			this.editor.setDecorations(endDecoration, [
				new vscode.Range(
					new vscode.Position(blockDecoration.endLine, 0),
					new vscode.Position(blockDecoration.endLine, 0)
				),
			]);
			this.lineDecorations.push(endDecoration);

			// mid lines decorations
			const midLines = blockDecoration.lines.length - 2;

			if (midLines > 0) {
				const midDecoration = decorationGenerators.mid(blockDecoration);

				this.editor.setDecorations(
					midDecoration,
					Array(midLines)
						.fill(undefined)
						.map(
							(_, index) =>
								new vscode.Range(
									new vscode.Position(
										blockDecoration.startLine + 1 + index,
										0
									),
									new vscode.Position(
										blockDecoration.startLine + 1 + index,
										0
									)
								)
						)
				);
				this.lineDecorations.push(midDecoration);
			}

			// title text
			const titleDecoration = decorationGenerators.title(blockDecoration);

			const titleIndex = blockDecoration.lines[0].indexOf(
				blockDecoration.name
			);
			const titleEndIndex = blockDecoration.lines
				.slice(-1)[0]
				.indexOf(blockDecoration.name);

			this.editor.setDecorations(titleDecoration, [
				new vscode.Range(
					new vscode.Position(blockDecoration.startLine, titleIndex),
					new vscode.Position(
						blockDecoration.startLine,
						titleIndex + blockDecoration.name.length
					)
				),
			]);
			this.lineDecorations.push(titleDecoration);

			// title hide
			const titleHideDecoration =
				decorationGenerators.titleHide(blockDecoration);

			this.editor.setDecorations(titleHideDecoration, [
				// before title
				new vscode.Range(
					new vscode.Position(
						blockDecoration.startLine,
						blockDecoration.whitespace.length
					),
					new vscode.Position(blockDecoration.startLine, titleIndex)
				),
				// after title
				new vscode.Range(
					new vscode.Position(
						blockDecoration.startLine,
						titleIndex + blockDecoration.name.length
					),
					new vscode.Position(
						blockDecoration.startLine,
						blockDecoration.lines[0].length
					)
				),

				// before title end
				new vscode.Range(
					new vscode.Position(
						blockDecoration.endLine,
						blockDecoration.whitespace.length
					),
					new vscode.Position(blockDecoration.endLine, titleEndIndex)
				),
				// after title end
				new vscode.Range(
					new vscode.Position(
						blockDecoration.endLine,
						titleEndIndex + blockDecoration.name.length
					),
					new vscode.Position(
						blockDecoration.endLine,
						blockDecoration.lines[0].length
					)
				),
			]);
			this.lineDecorations.push(titleHideDecoration);
		});
	}
}
