import theme from '../theme/theme';
import { BlockDecoration } from './BlockDecoration';
import { merge, cloneDeep } from 'lodash';
import overrides from '../theme/overrides';

export default function getComputedTheme(blockDecoration: BlockDecoration) {
	const computedTheme = cloneDeep(theme);

	const foundThemeOverride = overrides.find((o) =>
		blockDecoration.name.match(o.match)
	);

	// merge named overrides
	if (foundThemeOverride) {
		merge(computedTheme, foundThemeOverride.theme);
	}

	// merge inline overrides
	if (blockDecoration.overrides) {
		merge(computedTheme, blockDecoration.overrides);
	}

	// merge selected overrides
	if (blockDecoration.selected) {
		merge(computedTheme, computedTheme.selected);
	}

	return computedTheme;
}
