import * as vscode from 'vscode';
import DecorationManager from './DecorationManager/DecorationManager';
import CodeblockDecoration from './decorations/codeblock/CodeblockDecoration';

export default function handleDecorations() {
	const decorationManager = new DecorationManager();

	const handleVisibleTextEditorsChanged = (
		editors: readonly vscode.TextEditor[]
	) => {
		decorationManager.clear();
		editors.forEach((editor) => {
			const codeblockDecoration = new CodeblockDecoration(editor);

			decorationManager.addDecoration(editor, codeblockDecoration);

			codeblockDecoration.decorate();
		});
	};

	// first update on start
	handleVisibleTextEditorsChanged(vscode.window.visibleTextEditors);

	// update decorations whenever editors change (open / close)
	vscode.window.onDidChangeVisibleTextEditors(
		handleVisibleTextEditorsChanged
	);
	vscode.window.onDidChangeTextEditorSelection((event) => {
		decorationManager.decorateEditor(event.textEditor);
	});

	// update editors with this text document
	vscode.workspace.onDidChangeTextDocument((event) => {
		decorationManager.decorateDocument(event.document);
	});
}
