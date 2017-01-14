<template>
<div>
	<div class="card" v-if="bin" style="border-left: 0">
		<div class="row">
			<div class="col-7" id="bin-info">
				<div class="card-block" style="padding-top: 0">
				    <span class="name" id="bin-name" style="margin-left: 0">{{ bin.name }}</span>
			    </div>

			    <div class="card-block">
					<router-link class="btn btn-primary" tag="button" to="/refine">
				    	<span class="fa fa-cog"></span> Refine
					</router-link>
			    </div>
			</div>

			<div class="col-5" id="contig-plots">
				<div class="card-block">
			        <h6>GC%</h6>
			        <histogram :plotData="gcData" :color="bin.color"></histogram>

			        <h6 style="margin-top: 1rem">Length</h6>
			        <histogram :plotData="lengthData" :format="true" :color="bin.color"></histogram>
				</div>
			</div>
		</div>
	</div>	

	<router-link class="card-block" to="/overview">
		<strong style="font-size: 90%">BACK TO OVERVIEW</strong>
	</router-link>
</div>
</template>

<script>
import Histogram from '../charts/Histogram'

export default {
	data() {
		return {
			bin: null,
            gcData: {bins: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], hist: [0, 0, 0, 21, 908, 520, 1982, 66, 0, 0]},
            lengthData: {bins: [1005.0, 2463.923076923077, 3922.846153846154, 5381.7692307692305, 6840.692307692308, 8299.615384615385, 9758.538461538461, 11217.461538461539, 12676.384615384615, 14135.307692307691, 15594.23076923077, 17053.153846153844, 18512.076923076922, 19971.0], hist: [139, 26, 10, 5, 6, 8, 3074, 37, 36, 43, 43, 33, 37]}
		}
	},

	components: {
		Histogram
	},

	methods: {
		fetchData() {
			this.bin = this.bins.filter(bin => bin.id == this.$route.params.bin)[0]
		}
	},

	computed: {
		bins() {
			return this.$store.state.bins
		},
		routeBin() {
			return this.$route.params.bin
		}
	},

	watch: {
		'$route': 'fetchData'
	},

	created() {
		this.fetchData()
	}
}
</script>

<style>
#bin-info {
	padding-right: .1rem;
}	

#contig-plots {
	padding-left: .1rem;
	border-left: 1px solid #eee;
}

#bin-name::before {
    content: "Bin ";
}
</style>