import * as vscode from 'vscode';
import { merge, cloneDeep } from 'lodash';

import { BlockDecoration } from '../BlockDecoration/BlockDecoration';
import theme, { Theme } from './theme';

type ThemeOverride = Theme & {
	match: { target: 'name' | 'firstLine' | 'allLines'; regex: string };
};

export default function getConfiguredTheme(blockDecoration: BlockDecoration) {
	const configuration = vscode.workspace.getConfiguration('semanticscopes');

	const foundOverride = configuration.overrides.find(
		(override: ThemeOverride) => {
			const { match } = override;

			const re = new RegExp(match.regex);

			switch (match.target) {
				case 'name':
					return blockDecoration.name.match(re);
				case 'firstLine':
					return blockDecoration.lines[0].match(re);
				case 'allLines':
					return blockDecoration.lines.some((line) => line.match(re));
			}
		}
	);

	const configuredTheme = cloneDeep(theme);

	// merge with configuration theme
	if (configuration.theme) {
		merge(configuredTheme, configuration.theme);
	}

	// merge with overrides
	if (foundOverride) {
		merge(configuredTheme, foundOverride);
	}

	return configuredTheme;
}
