import theme from '../theme/theme';

interface BlockDecoration {
	startLine: number;
	endLine: number;
	lines: string[];
	whitespace: string;
	whitespaceOffset: number;
	selected: boolean;
	overrides: Partial<typeof theme>;
	name: string;
}

interface PendingBlockDecoration {
	startLine: number;
	name: string;
	whitespace: string;
	overrides: string;
}

export { PendingBlockDecoration, BlockDecoration };
