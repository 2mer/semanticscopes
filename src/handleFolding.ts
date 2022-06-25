import * as vscode from 'vscode';
import CodeblockFoldingProvider from './decorations/codeblock/CodeblockFoldingProvider';

export default function handleFolding(context: vscode.ExtensionContext) {
	const disposable = vscode.languages.registerFoldingRangeProvider(
		{ pattern: '**/*' },
		new CodeblockFoldingProvider()
	);

	// make sure this gets cleaned up
	context.subscriptions.push(disposable);
}
