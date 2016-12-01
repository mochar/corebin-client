<template>
<path
    :style="style"
    :d="d">
</path>
</template>

<script>
export default {
	props: ['ribbon', 'selectedBin', 'hoveredBin', 'binsMap', 'rgb', 'd'],

	computed: {
		style() {
			const bin = this.hoveredBin ? this.hoveredBin : this.selectedBin
			let color = '#bbb'
			if (this.ribbon.target.data === bin) {
				color = this.binsMap.get(this.ribbon.source.data).color
			} else if (this.ribbon.source.data === bin) {
				color = this.binsMap.get(this.ribbon.target.data).color
			} 
			return { fill: color, stroke: this.rgb(color).darker() }
		}
	}
}
</script>