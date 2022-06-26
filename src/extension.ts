import * as vscode from 'vscode';
import handleCommands from './handleCommands';
import handleDecorations from './handleDecorations';
import handleFolding from './handleFolding';
import handleTreeView from './handleTreeView';

export function activate(context: vscode.ExtensionContext) {
	console.log('Semantic scope is active!');

	// syntax decoration happens here
	handleDecorations(context);

	// code related to folding blocks here
	handleFolding(context);

	// command related code here
	handleCommands(context);

	// tree view code here
	handleTreeView(context);

	// TODO:
	// 	- handle code block rename (rename provider)
	//  - handle caret inside higher block nested background
}

// this method is called when your extension is deactivated
export function deactivate() {}
