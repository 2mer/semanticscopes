import * as vscode from 'vscode';
import parseBlockDecorations from '../../BlockDecoration/parseBlockDecorations';

export default class CodeblockFoldingProvider
	implements vscode.FoldingRangeProvider
{
	onDidChangeFoldingRanges?: vscode.Event<void> | undefined;

	provideFoldingRanges(
		document: vscode.TextDocument,
		context: vscode.FoldingContext,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.FoldingRange[]> {
		const blockDecorations = parseBlockDecorations(document);

		const foldingRanges: vscode.FoldingRange[] = blockDecorations.map(
			(blockDecoration) => {
				return new vscode.FoldingRange(
					blockDecoration.startLine,
					blockDecoration.endLine,
					vscode.FoldingRangeKind.Region
				);
			}
		);

		return foldingRanges;
	}
}
