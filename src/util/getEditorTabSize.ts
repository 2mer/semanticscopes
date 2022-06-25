import { TextEditor } from 'vscode';

export default function getEditorTabSize(editor: TextEditor) {
	let tabSize = editor.options.tabSize;
	if (typeof tabSize !== 'number') {
		tabSize = 2;
	}

	return tabSize;
}
