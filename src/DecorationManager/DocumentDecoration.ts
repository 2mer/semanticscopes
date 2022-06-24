import * as vscode from 'vscode';

export default abstract class DocumentDecoration {
	editor;

	constructor(editor: vscode.TextEditor) {
		this.editor = editor;
	}

	decorate() {}

	dispose() {}
}
