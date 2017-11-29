<template>
<div style="display: inline-block">
	<slot name="button"></slot>
	<div class="webui-popover-content">
		<div class="popover-body">
			<slot name="body"></slot>
		</div>
	</div>
</div>	
</template>

<script>
import webuiPopover from 'webui-popover'

export default {
	props: {
		options: {
			default() {
				return {}
			}
		}
	},

	mounted() {
		const els = $(this.$el).find('div')
		// $(this.$el).find('button').first().webuiPopover(this.options)
		$(this.$el).find('*').first().webuiPopover(this.options)
	}
}	
</script>

<style>
.popover-body {
	display: inline;
}
</style>