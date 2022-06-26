import * as vscode from 'vscode';
import parseBlockDecorations from './BlockDecoration/parseBlockDecorations';
import CodeblockTreeItem from './CodeblockTreeview/CodeblockTreeitem';

let codeblockSelections: vscode.Selection[] = [];

export default function handleCommands(context: vscode.ExtensionContext) {
	// @[logic]
	const registerCommand: (
		...parameters: Parameters<
			typeof vscode.commands.registerTextEditorCommand
		>
	) => void = (name, handle) => {
		const dispose = vscode.commands.registerTextEditorCommand(name, handle);

		context.subscriptions.push(dispose);
	};
	// [logic]@

	// @[commands]

	registerCommand('semanticscopes.selectCodeblockComments', (textEditor) => {
		textEditor.selections = codeblockSelections;
	});

	registerCommand(
		'semanticscopes.peekTreeItemCodeblock',
		(textEditor, __, codeblockTreeItem: CodeblockTreeItem) => {
			const blockDecoration =
				codeblockTreeItem.blockEntry.blockDecoration;

			return vscode.commands.executeCommand<vscode.Location[]>(
				'editor.action.peekLocations',
				textEditor.document.uri,
				textEditor.selection.start,
				[
					new vscode.Location(
						textEditor.document.uri,
						new vscode.Position(
							blockDecoration.startLine,
							blockDecoration.whitespaceOffset
						)
					),
				],
				'peek'
			);
		}
	);

	registerCommand(
		'semanticscopes.gotoCodeblock',
		(textEditor, __, codeblockTreeItem: CodeblockTreeItem) => {
			const blockDecoration =
				codeblockTreeItem.blockEntry.blockDecoration;

			return vscode.commands.executeCommand<vscode.Location[]>(
				'editor.action.goToLocations',
				textEditor.document.uri,
				new vscode.Position(
					blockDecoration.startLine,
					blockDecoration.whitespaceOffset
				),
				[],
				'goto'
			);
		}
	);

	registerCommand('semanticscopes.toggleCodeblock', (textEditor, edit) => {
		const { selections, document: textDocument } = textEditor;
		const text = textDocument.getText();
		const lines = text.split('\n');

		const blockDecorations = parseBlockDecorations(textDocument);

		const allSelectionsAreBlocks = selections.every((selection) => {
			return blockDecorations.some(
				(blockDecoration) =>
					blockDecoration.startLine === selection.start.line &&
					blockDecoration.endLine === selection.end.line
			);
		});

		// if all selections are blocks, we remove the scope
		// else, we insert new blocks around the selections
		if (allSelectionsAreBlocks) {
			selections.forEach((selection) => {
				const startLine = lines[selection.start.line];
				const endLine = lines[selection.end.line];

				edit.delete(
					new vscode.Range(
						selection.start.line,
						0,
						selection.start.line,
						startLine.length
					)
				);
				edit.delete(
					new vscode.Range(
						selection.end.line,
						0,
						selection.end.line,
						endLine.length
					)
				);
			});
		} else {
			const newSelections: vscode.Selection[] = [];
			const newNameSelections: vscode.Selection[] = [];

			// insert block lines
			textEditor
				.edit(
					(edit) => {
						let selectionOffset = 0;
						selections.forEach((selection) => {
							const startLine = lines[selection.start.line];
							// const endLine = lines[selection.end.line];

							const whitespace =
								(startLine.match(/^(\s*)/) || [])[1] || '';

							edit.insert(
								new vscode.Position(selection.start.line, 0),
								`${whitespace}@[Block]\n`
							);
							edit.insert(
								new vscode.Position(selection.end.line + 1, 0),
								`${whitespace}[Block]@\n`
							);

							newSelections.push(
								new vscode.Selection(
									selection.start.line + selectionOffset,
									0,
									selection.start.line + selectionOffset,
									0
								)
							);
							selectionOffset++;
							newSelections.push(
								new vscode.Selection(
									selection.end.line + selectionOffset + 1,
									0,
									selection.end.line + selectionOffset + 1,
									0
								)
							);
							selectionOffset++;
						});

						codeblockSelections = newSelections;
					},
					{ undoStopAfter: false, undoStopBefore: false }
				)
				.then(() => {
					return vscode.commands.executeCommand(
						'semanticscopes.selectCodeblockComments'
					);
				})
				.then(() => {
					return vscode.commands.executeCommand(
						'editor.action.addCommentLine'
					);
				});
		}
	});
	// [commands]@
}
