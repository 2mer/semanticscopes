import * as vscode from 'vscode';
import { BlockHierarchyEntry } from '../util/getBlockHierarchy';

export default class CodeblockTreeItem extends vscode.TreeItem {
	blockEntry;

	constructor(
		blockEntry: BlockHierarchyEntry,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(blockEntry?.blockDecoration?.name, collapsibleState);
		this.blockEntry = blockEntry;
	}
}
