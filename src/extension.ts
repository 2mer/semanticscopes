import * as vscode from 'vscode';
import handleDecorations from './handleDecorations';
import handleFolding from './handleFolding';

export function activate(context: vscode.ExtensionContext) {
	console.log('Semantic scope is active!');

	// syntax decoration happens here
	handleDecorations();

	// code related to folding blocks here
	handleFolding(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
