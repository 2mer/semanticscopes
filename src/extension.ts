import * as vscode from 'vscode';
import handleDecorations from './handleDecorations';

export function activate(context: vscode.ExtensionContext) {
	console.log('Semantic scope is active!');

	// syntax decoration happens here
	handleDecorations();
}

// this method is called when your extension is deactivated
export function deactivate() {}
