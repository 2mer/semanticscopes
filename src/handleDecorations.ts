import * as vscode from 'vscode';
import DecorationManager from './DecorationManager/DecorationManager';
import CodeblockDecoration from './decorations/codeblock/CodeblockDecoration';

export default function handleDecorations(context: vscode.ExtensionContext) {
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
	context.subscriptions.push(
		vscode.window.onDidChangeVisibleTextEditors(
			handleVisibleTextEditorsChanged
		)
	);

	// update decorations when the text editor's selection has changed
	// used to determine selected blocks state
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection((event) => {
			decorationManager.decorateEditor(event.textEditor);
		})
	);

	// update editors with this text document
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event) => {
			decorationManager.decorateDocument(event.document);
		})
	);
}
