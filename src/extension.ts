import * as vscode from 'vscode';
import handleCommands from './handleCommands';
import handleDecorations from './handleDecorations';
import handleFolding from './handleFolding';

export function activate(context: vscode.ExtensionContext) {
	console.log('Semantic scope is active!');

	// syntax decoration happens here
	handleDecorations();

	// code related to folding blocks here
	handleFolding(context);

	// command related code here
	handleCommands(context);

	// TODO:
	// 	- handle peeking blocks (command editor.action.peekLocations)
	// 	- handle code block rename (rename provider)
	//  - handle caret inside higher block nested background
}

// this method is called when your extension is deactivated
export function deactivate() {}
