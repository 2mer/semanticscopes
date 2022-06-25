import { BlockDecoration } from '../BlockDecoration/BlockDecoration';
import { merge } from 'lodash';
import getConfiguredTheme from './getConfiguredTheme';

export default function getComputedTheme(blockDecoration: BlockDecoration) {
	const computedTheme = getConfiguredTheme(blockDecoration);

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
