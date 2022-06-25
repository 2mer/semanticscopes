import * as vscode from 'vscode';

import { BlockDecoration } from '../../BlockDecoration/BlockDecoration';
import getComputedTheme from '../../theme/getComputedTheme';

const decorationGenerators = {
	start: (blockDecoration: BlockDecoration) => {
		const currentTheme = getComputedTheme(blockDecoration);

		return vscode.window.createTextEditorDecorationType({
			before: {
				contentText: ``,
				textDecoration: `;box-sizing: content-box !important;
					background-color: ${currentTheme.background};
					border-top: 1px solid ${currentTheme.primary};
					border-left: 1px solid ${currentTheme.primary};
					position: absolute;
					z-index: -1;
					top: 0px;
					left: ${blockDecoration.whitespaceOffset}ch;
					right: 0px;
					bottom: 0px;
					pointer-events: none;
				`,
			},
		});
	},
	mid: (blockDecoration: BlockDecoration) => {
		const currentTheme = getComputedTheme(blockDecoration);

		return vscode.window.createTextEditorDecorationType({
			before: {
				contentText: ``,
				textDecoration: `;box-sizing: content-box !important;
					background-color: ${currentTheme.background};
					border-left: 1px solid ${currentTheme.primary};
					position: absolute;
					z-index: -1;
					top: 0px;
					left: ${blockDecoration.whitespaceOffset}ch;
					right: 0px;
					bottom: 0px;
					pointer-events: none;
				`,
			},
		});
	},
	end: (blockDecoration: BlockDecoration) => {
		const currentTheme = getComputedTheme(blockDecoration);

		return vscode.window.createTextEditorDecorationType({
			before: {
				contentText: ``,
				textDecoration: `;box-sizing: content-box !important;
					background-color: ${currentTheme.background};
					border-bottom: 1px solid ${currentTheme.primary};
					border-left: 1px solid ${currentTheme.primary};
					position: absolute;
					z-index: -1;
					top: 0px;
					left: ${blockDecoration.whitespaceOffset}ch;
					right: 0px;
					bottom: 0px;
					pointer-events: none;
				`,
			},
		});
	},
	title: (blockDecoration: BlockDecoration) => {
		const currentTheme = getComputedTheme(blockDecoration);

		return vscode.window.createTextEditorDecorationType({
			backgroundColor: currentTheme.primary,
			color: currentTheme.text,
			borderRadius: '0 0 6px 0',
			fontStyle: 'normal',
		});
	},
	titleHide: (blockDecoration: BlockDecoration) => {
		return vscode.window.createTextEditorDecorationType({
			opacity: '0',
			letterSpacing: '-1ch',
		});
	},
};

export default decorationGenerators;
