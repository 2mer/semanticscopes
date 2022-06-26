import { BlockDecoration } from '../BlockDecoration/BlockDecoration';

export type BlockHierarchyEntry = {
	blockDecoration: BlockDecoration;
	children: BlockHierarchyEntry[];
};

export default function getBlockHierarchy(blockDecorations: BlockDecoration[]) {
	const ret: BlockHierarchyEntry[] = [];
	const blockStack: BlockHierarchyEntry[] = [];
	const lookup = new Map<BlockDecoration, BlockHierarchyEntry>();

	blockDecorations
		.sort((a, b) => {
			return a.startLine - b.startLine;
		})
		.forEach((dec) => {
			const handleBlock = (currentDecoration: BlockDecoration) => {
				const head = blockStack?.[blockStack.length - 1];

				// if there is no parent node, become the parent node
				if (!head) {
					const entry = {
						blockDecoration: currentDecoration,
						children: [],
					};

					ret.push(entry);
					blockStack.push(entry);
					lookup.set(currentDecoration, entry);
					return;
				}

				// the current block is inside the previous block
				if (
					head.blockDecoration.endLine > currentDecoration.startLine
				) {
					const entry = {
						blockDecoration: currentDecoration,
						children: [],
					};

					head.children.push(entry);
					blockStack.push(entry);
					lookup.set(currentDecoration, entry);

					return;
				}

				// the current block does not contain this block, take a step out and try again
				// until you find a new containing block or create one if none are found
				blockStack.pop();
				handleBlock(currentDecoration);
			};

			handleBlock(dec);
		});

	return [ret, lookup] as const;
}
