import * as vscode from 'vscode';
import DocumentDecoration from '../DecorationManager/DocumentDecoration';
import getEditorTabSize from '../util/getEditorTabSize';
import { BlockDecoration } from './BlockDecoration';
import parseBlockDecorations from './parseBlockDecorations';

export default abstract class BlockDecorationManager extends DocumentDecoration {
	blockDecorations: BlockDecoration[] = [];
	lineDecorations: vscode.TextEditorDecorationType[] = [];

	constructor(editor: vscode.TextEditor) {
		super(editor);
	}

	clear() {
		this.blockDecorations = [];
		this.lineDecorations.forEach((decoration) => {
			decoration.dispose();
		});
		this.lineDecorations = [];
	}

	getBlockRanges() {
		return this.blockDecorations;
	}

	parseBlocks() {
		const textDocument = this.editor.document;

		this.blockDecorations = parseBlockDecorations(textDocument, {
			tabSize: getEditorTabSize(this.editor),
			selections: this.editor.selections,
		});
	}

	abstract createDecorations(): void;

	decorate(): void {
		this.clear();
		this.parseBlocks();

		this.createDecorations();
	}
}
