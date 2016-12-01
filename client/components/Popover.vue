<template>
<div style="display: inline-block">
	<slot name="button"></slot>
	<div class="webui-popover-content">
		<div class="popover-body">
			<slot name="body"></slot>
		</div>
	</div>

<!-- 	<div class="popover-button">
		<slot name="button"></slot>
	</div>

	<div class="popover-body"> 
		<slot name="body"></slot>
	</div>
 -->	
</div>	
</template>

<script>
import webuiPopover from 'webui-popover'

export default {
	mounted() {
		const els = $(this.$el).find('div')
		$(this.$el).find('button').webuiPopover({
			// url: '.popover-body'
		})
	}
}	
</script>

<style>
.popover-body {
	display: inline;
}
</style>