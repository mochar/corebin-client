<template>
<div></div>
</template>

<script>
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            margin: {top: 5, right: 8, bottom: 18, left: 5}
        }
    },
    
    props: {
        plotData: {
            type: Object,
            default: function () {
                return { bins: [], hist: [] }
            }
        },
        format: {
            type: Boolean,
            default: false
        }
    },
    
    methods: {
        updatePlot: function() {
            let width = parseInt(d3.select(this.$el).style('width'), 10)
            width = width - this.margin.left - this.margin.right
            let height = parseInt(d3.select(this.$el).style('width'), 10) * 0.8
            height = height - this.margin.top - this.margin.bottom
                
            let bins = this.plotData.bins
            let data = this.plotData.hist
            
            // Thousands formatter: 23123 -> 23k
            let format = this.format ? d3.formatPrefix(',.0', 1e3) : d3.format('')
            
            // Setup x and y
            let x = d3.scalePoint().range([0, width]).domain(bins)
            let y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data)])
            let xAxis = d3.axisBottom(x).tickFormat(format)
            this.svg.select('.x').call(xAxis)
            
            // Remove all bars
            this.svg.selectAll('.bar').remove()
            
            // Update with new bars
            let bar = this.svg.selectAll('.bar').data(data)
            
            const rect = bar.enter().append('rect')
                .attr('class', 'bar')
                .attr('x', (d, i) => x(bins[i]))
                .attr('y', height)
                .attr('width', width / data.length -1)
                .attr('height', 0)
            rect.transition()
                .attr('height', d => height - y(d))
                .attr('y', d => y(d))
            rect.append('title')
                .text(d => d)
        }
    },
    
    mounted: function() {
        let width = parseInt(d3.select(this.$el).style('width'), 10)
        width = width - this.margin.left - this.margin.right
        let height = parseInt(d3.select(this.$el).style('width'), 10) * 0.8
        height = height - this.margin.top - this.margin.bottom
        this.svg = d3.select(this.$el).append('svg')
                .attr('width', width + this.margin.left + this.margin.right)
                .attr('height', height + this.margin.top + this.margin.bottom)
            .append('g')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        
        this.svg.append('g')
            .attr('class', 'x axis hist-axis')
            .attr('transform', 'translate(0,' + height + ')')
            
        this.updatePlot()
    },

    updated: function() {
        console.log('update')
        this.updatePlot()
    }
}
</script>

<style>
.bar {
  fill: steelblue;
  shape-rendering: crispEdges;
}

.bar:hover {
  fill: brown;
}
</style>
