<template>
<div>
    <svg :width="width" :height="height">
        <g class="x axis" :transform="`translate(0,${height-10})`"></g>
        <g class="y axis" :transform="'translate(10,0)'"></g>
    </svg>
</div>
</template>

<script>
import { lasso as d3Lasso } from 'd3-lasso'
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            zoom: null,
            x: null,
            y: null,
            xAxis: null,
            yAxis: null,
            lasso: d3Lasso(),
            height: 100,
            width: 100
        }
    },
    
    props: ['contigs', 'xData', 'yData'],
    
    methods: {
        updatePlot() {
            this.x = d3.scaleLinear()
                .domain([d3.min(this.contigs, c => c[this.xData]), d3.max(this.contigs, c => c[this.xData])])
                .range([0, this.width])
                
            this.y = d3.scaleLinear()
                .domain([d3.min(this.contigs, c => c[this.yData]), d3.max(this.contigs, c=> c[this.yData])])
                .range([0, this.height])
            
            this.xAxis = d3.axisTop(this.x).ticks(12)
            this.yAxis = d3.axisRight(this.y).ticks(12 * this.height / this.width)

            this.svg.select('g.x').call(this.xAxis)
            this.svg.select('g.y').call(this.yAxis)

            const circle = this.svg.selectAll('circle')
                .data(this.contigs, c => c.id)

            circle.transition()
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))

            circle.exit().transition()
                .attr('r', 0)
                .remove()

            circle.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', 0)
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))
                .attr('fill', contig => contig[`color_${this.binSet}`])
                .style('opacity', .5)
              .transition()
                .attr('r', 4)
        },
        zoomed() {
            const t = this.svg.transition().duration(750)
            this.svg.select('g.x').transition(t).call(this.xAxis)
            this.svg.select('g.y').transition(t).call(this.yAxis)
            this.svg.selectAll('circle').transition(t)
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))
        }
    },

    mounted() {
        this.width = parseInt(d3.select(this.$el).style('width'), 10)
        this.height = this.width
        this.svg = d3.select(this.$el).select('svg')
        
        this.zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
            .on('zoom', this.zoomed);

        // lasso.closePath
            
        this.svg.call(this.zoom)
    
        this.updatePlot()
    },

    computed: {
        binSet() {
            return this.$store.state.binSet.id
        }
    },

    watch: {
        contigs() {
            this.updatePlot()
        }
    }
}
</script>

<style>
.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.3;
  shape-rendering: crispEdges;
}
</style>
