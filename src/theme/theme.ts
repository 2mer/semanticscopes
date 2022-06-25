// this is the default shipped theme, configuration overrides are merged with this as the base
const theme = {
	primary: '#2196f3',
	background: 'rgba(200,200,255,0.05)',
	text: 'white',
	selected: {
		primary: '#00b0ff',
		background: 'transparent',
		text: 'white',
	},
};

export type Theme = typeof theme;

export default theme;
