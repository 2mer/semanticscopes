import * as vscode from 'vscode';

import DocumentDecorations from './DocumentDecoration';

export default class DecorationManager {
	decorations = new Map<vscode.TextEditor, DocumentDecorations>();

	constructor() {}

	addDecoration(editor: vscode.TextEditor, decoration: DocumentDecorations) {
		this.decorations.set(editor, decoration);
	}

	removeDecoration(editor: vscode.TextEditor) {
		const decoration = this.decorations.get(editor);

		if (decoration) {
			this.decorations.delete(editor);
			decoration.dispose();
		}
	}

	clear() {
		Array.from(this.decorations.values()).forEach((decoration) => {
			decoration.dispose();
		});
		this.decorations.clear();
	}

	decorateDocument(textDocument: vscode.TextDocument) {
		vscode.window.visibleTextEditors.forEach((editor) => {
			const docUri = textDocument.uri.toString();

			// find all open editors with the document open
			if (editor.document.uri.toString() === docUri) {
				const decoration = this.decorations.get(editor);

				if (decoration) {
					decoration.decorate();
				}
			}
		});
	}

	decorateEditor(editor: vscode.TextEditor) {
		const decoration = this.decorations.get(editor);

		if (decoration) {
			decoration.decorate();
		}
	}

	dispose() {
		this.clear();
	}
}
