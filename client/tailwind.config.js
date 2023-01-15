/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
	purge: [
		'./public/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx,vue}',
	],
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: [
        {
            pattern: /(bg|text|border|outline)-(sky|rose|amber|emerald|red|gray|orange|purple|violet|blue|teal|pink|neutral)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ['hover','focus'],
        },
	],
}