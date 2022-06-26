import * as vscode from 'vscode';
import CodeblockTreeview from './CodeblockTreeview/CodeblockTreeview';

export default function handleTreeView(context: vscode.ExtensionContext) {
	const codeblockTreeview = new CodeblockTreeview();

	context.subscriptions.push(
		vscode.window.registerTreeDataProvider(
			'semanticScopes',
			codeblockTreeview
		)
	);

	// reload tree on text changed in the active editor
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event) => {
			if (
				event.document.uri ===
				vscode.window.activeTextEditor?.document?.uri
			) {
				codeblockTreeview.refresh();
			}
		})
	);

	// reload tree when the active text editor changes
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(() => {
			codeblockTreeview.refresh();
		})
	);
}
