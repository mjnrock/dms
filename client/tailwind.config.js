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
            pattern: /(bg|text|border)-(red|gray|orange|purple|blue|teal)-(200|400)/,
            variants: ['hover'],
        },
	],
}