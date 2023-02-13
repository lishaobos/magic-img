// eslint-disabled-all
const { build } = require('vite')
const vue2 = require('@vitejs/plugin-vue2')
const vue3 = require('@vitejs/plugin-vue')
const compiler = require('vue2-compiler')

const createBuildOptions = pkg => ({
	define: {},
	build: {
		emptyOutDir: false,
		lib: {
			entry: './src/frameWork/vue',
			name: 'MagicImage',
			fileName: pkg,
		},
		rollupOptions: {
			external: 'vue',
			output: {
				format: ['es'],
				globals: {
					vue: 'Vue'
				}
			},
			plugins: [
				pkg === 'vue2' ? vue2({ compiler }) : vue3()
			]
		}
	}
})

const excute = async () => {
	await build(createBuildOptions('vue2'))
	await build(createBuildOptions('vue3'))
}

excute()