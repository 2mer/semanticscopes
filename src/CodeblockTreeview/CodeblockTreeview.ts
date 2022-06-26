import * as vscode from 'vscode';
import parseBlockDecorations from '../BlockDecoration/parseBlockDecorations';
import getBlockHierarchy, {
	BlockHierarchyEntry,
} from '../util/getBlockHierarchy';
import CodeblockTreeItem from './CodeblockTreeitem';

export default class CodeblockTreeview
	implements vscode.TreeDataProvider<CodeblockTreeItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<
		CodeblockTreeItem | undefined | null | void
	> = new vscode.EventEmitter<CodeblockTreeItem | undefined | null | void>();

	onDidChangeTreeData?:
		| vscode.Event<
				| void
				| CodeblockTreeItem
				| CodeblockTreeItem[]
				| null
				| undefined
		  >
		| undefined = this._onDidChangeTreeData.event;

	getTreeItem(
		element: CodeblockTreeItem
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element;
	}

	getChildren(
		element?: CodeblockTreeItem | undefined
	): vscode.ProviderResult<CodeblockTreeItem[]> {
		const createTreeItem = (b: BlockHierarchyEntry) =>
			new CodeblockTreeItem(
				b,
				b.children.length
					? vscode.TreeItemCollapsibleState.Expanded
					: vscode.TreeItemCollapsibleState.None
			);

		// if element does not exist, this is the root of the tree
		if (!element) {
			const currentEditor = vscode.window.activeTextEditor;

			if (currentEditor) {
				const textDocument = currentEditor.document;
				const blockDecorations = parseBlockDecorations(textDocument);
				const [tree] = getBlockHierarchy(blockDecorations);

				return Promise.resolve(tree.map(createTreeItem));
			} else {
				// no editor is open, nothing to display
				return Promise.resolve([]);
			}
		}

		// element exists, get element children
		return Promise.resolve(element.blockEntry.children.map(createTreeItem));
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}
