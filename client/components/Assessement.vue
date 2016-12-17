<template>
<div class="row">
    <div class="col-xs-4">
        <select class="custom-select btn-block">
              <option selected>Rank</option>
        </select>
        <select class="custom-select btn-block">
              <option selected>Taxon</option>
        </select>
        <button class="btn btn-block btn-outline-primary">
        	Assess
        </button>
    </div>

    <div class="col-xs-8">
    	<table class="table">
    		<thead>
    			<tr>
    				<th>Rank</th>
    				<th>Taxon</th>
    				<th>Cont.</th>
    				<th>Comp.</th>
    			</tr>
    		</thead>
    		<tbody>
    			<tr
    				v-for="assessement in assessements">
    			</tr>
    		</tbody>
    	</table>
    	<small class="text-muted">
    		Select assessement to be used in tables and figures by clicking the row.
    	</small>
    </div>
</div>
</template>

<script>
export default {
	data() {
		return {
			assessements: []
		}
	}
}
</script>