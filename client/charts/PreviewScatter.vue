<template>
<svg :width="width" :height="height" id="preview-scatter">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0.0%" stop-color="#f00"></stop>
            <stop offset="100.0%" stop-color="#00f"></stop>
        </linearGradient>
    </defs>
    <rect :width="width" :height="height" fill="white"></rect>
    <g class="legend" :transform="`translate(${width},0)`">
        <g v-if="colorBy === 'gc'" transform="translate(0, 20)">
            <text text-anchor="start" x="-30">GC</text>
            <g class="axis" id="legend-axis" transform="translate(-30, 10)"></g>
            <rect 
                :width="20" 
                :height="120" 
                :y="12" :x="-30" 
                class="color-legend">
            </rect>
        </g>
        <g v-else v-for="(bin, i) in $store.state.refineBins" :transform="`translate(-20,${i*30+20})`">
            <circle r="6" cx="0" cy="0" :fill="bin.color"></circle>
            <text :x="-10" y="5" text-anchor="end">{{ bin.name }}</text>
        </g>
    </g>
    <g class="x axis" :transform="`translate(0,${height})`"></g>
    <g class="y axis" :transform="'translate(0,0)'"></g>
    <g>
        <circle v-for="contig in contigs"
            class="dot"
            :cx="x(contig[xData])"
            :cy="y(contig[yData])"
            opacity=".5"
            :r="sizeScale(contig.length)"
            :fill="colorBy == 'gc' ? colorScale(contig.gc) : contig[`color_${colorBinSet}`]"
        >
        </circle>
    </g>

    <text class="axis-label" :transform="`translate(${width-10},${height})`" text-anchor="end">
        {{ xData }}
    </text>
    <text>
    </text>
</svg>
</template>

<script>
import * as d3 from 'd3'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            x: null,
            y: null,
            svg: null,
            width: 100,
            height: 100,
            sizeScale: null,
            colorScale: null,
            zoom: null,
            xAxis: null,
            yAxis: null
        }
    },
    
    props: ['ratio'],

    methods: {
        zoomed() {
            this.svg.select('g.x')
                .call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
            this.svg.select('g.y')
                .call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))
            this.svg.selectAll('circle.dot')
                .attr('transform', d3.event.transform)
        }
    },

    mounted() {
        this.width = $(this.$el).parent().width()
        this.height = this.width * this.ratio
        this.svg = d3.select(this.$el)
        
        this.zoom = d3.zoom()
            .scaleExtent([.5, 5])
            .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
            .on('start', null)
            .on('zoom', this.zoomed);

        this.x.range([0, this.width])
        this.y.range([0, this.height])
        
        this.xAxis = d3.axisTop(this.x).ticks(12)
        this.yAxis = d3.axisRight(this.y).ticks(12 * this.height / this.width)

        this.svg.call(this.zoom)
        this.svg.select('g.x').call(this.xAxis)
        this.svg.select('g.y').call(this.yAxis)
    },

    created() {
        this.x = this.xLog ? d3.scaleLog() : d3.scaleLinear()
        this.x.domain([d3.min(this.contigs, c => c[this.xData]), d3.max(this.contigs, c => c[this.xData])])

        this.y = this.yLog ? d3.scaleLog() : d3.scaleLinear()
        this.y.domain([d3.min(this.contigs, c => c[this.yData]), d3.max(this.contigs, c=> c[this.yData])])

        this.colorScale = d3.scaleLinear()
            .domain([0.3, 0.7])
            .range(['blue', 'red'])

        this.sizeScale = d3.scaleLog()
            .clamp(true)
            .domain([10000, 200000])
            .range([4, 10])
    },

    computed: {
        binSet() {
            return this.$store.state.binSet.id
        },
        ...mapState([
            'xData',
            'yData',
            'xLog',
            'yLog',
            'colorBy',
            'colorBinSet',
            'contigs',
            'refineBinSet'
        ])
    }
}
</script>


<style scoped>
.axis-label {
    font-weight: bold;
}
</style>