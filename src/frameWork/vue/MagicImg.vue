<template>
	<div ref='magicImage' magic-img :magic="data.magic">
		<svg 
			v-if="data.magic !== 'lqip'"
			class='magic-placeholder'
			:status="placeholderStatus"
			preserveAspectRatio='none' 
			v-html="data.content"
			:width="data.width"
			:height="data.height"
			:viewBox="`0 0 ${data.width_ || data.width} ${data.height_ || data.height}`"
		></svg>
		<img 
			v-else 
			class='magic-placeholder' 
			:status="placeholderStatus" 
			:src="data.content"
			:width="data.width"
			:height="data.height"
			alt="" 
		/>
		<img 
			class='magic-target' 
			:status="targetStatus" 
			:src="realSrc" 
			alt="" 
		/>
	</div>
</template>

<script>
export default {
	name: 'MagicImg',
	props: {
		src: {
			required: true,
			type: String,
			default: ''
		}
	},
	computed: {
		data({ src }) {
			try {
				return JSON.parse(src)
			} catch {
				return {}
			}
		}
	},
	data() {
		return {
			placeholderStatus: '',
			targetStatus: '',
			realSrc: ''
		}
	},
	mounted() {
		this.setObserver()
	},
	watch: {
		src() {
			this.start()
		}
	},
	methods: {
		setObserver() {
			const intersection = new IntersectionObserver(async (entrys) => {
				for (const { isIntersecting } of entrys) {
					if (isIntersecting) {
						this.start()
						intersection.unobserve(this.$refs.magicImage)
						intersection.disconnect()
					}
				}
			})
			intersection.observe(this.$refs.magicImage)
		},
		start() {
			const { data } = this
			this.placeholderStatus = 'from'
			this.targetStatus = 'from'
			const start = performance.now()
			const img = new Image()
			img.onload = () => requestAnimationFrame(() => {
				const status = performance.now() - start > 100 ? 'to' : 'noPrevice'
				this.realSrc = data.src
				this.placeholderStatus = status
				this.targetStatus = status
			})
		
			img.src = data.src
		},
	}
}
</script>