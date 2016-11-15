<template>
<div></div>
</template>

<script>
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            view: null,
            zoom: null,
            x: null,
            y: null,
            xAxis: null,
            yAxis: null
        }
    },
    
    props: ['contigs', 'xData', 'yData'],
    
    methods: {
        updatePlot() {
        },
        zoomed() {
            this.view.attr('transform', d3.event.transform)
            d3.select(this.$el).select('g.x').call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
            d3.select(this.$el).select('g.y').call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))
        }
    },

    mounted() {
        const width = parseInt(d3.select(this.$el).style('width'), 10)
        const height = width
        this.svg = d3.select(this.$el).append('svg').attr('width', width).attr('height', height)
        
        this.zoom = d3.zoom()
            .scaleExtent([1, 40])
            .translateExtent([[-100, -100], [width + 90, height + 100]])
            .on('zoom', this.zoomed);
        
        this.x = d3.scaleLinear()
            .domain([d3.min(this.contigs, c => c[xData]), d3.max(this.contigs, c => c[xData])])
            .range([0, width])
            
        this.y = d3.scaleLinear()
            .domain([d3.min(this.contigs, c => c[yData]), d3.max(this.contigs, c=> c[yData])])
            .range([0, height])
        
        this.xAxis = d3.axisBottom(this.x)
            .ticks((width + 2) / (height + 2) * 10)
            .tickSize(height)
            .tickPadding(8 - height)

        this.yAxis = d3.axisRight(this.y)
            .ticks(10)
            .tickSize(width)
            .tickPadding(8 - width)
            
        this.view = this.svg.append('rect')
            .attr('class', 'view')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height)
            
        this.svg.append('g')
            .attr('class', 'x axis hist-axis')
            .call(this.xAxis)
        
        this.svg.append('g')
            .attr('class', 'y axis hist-axis')
            .call(this.yAxis)
            
        this.svg.call(this.zoom)
    
        this.updatePlot()
    },

    updated: function() {
        console.log('update')
        this.updatePlot()
    }
}
</script>

<style scoped>
.axis path {
  display: none;
}

.axis line {
  stroke-opacity: 0.3;
  shape-rendering: crispEdges;
}
</style>
