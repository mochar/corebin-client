<template>
<svg :width="`${width + margin.left + margin.right}`" :height="`${height + margin.top + margin.bottom}`">
    <g :transform="`translate(${margin.left}, ${margin.top})`">
        <g class="x axis hist-axis" :transform="`translate(0,${height})`"></g>
    </g>
</svg>
</template>

<script>
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            width: 10,
            height: 10,
            margin: {top: 0, right: 100, bottom: 18, left: 5}
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
        },
        color: {
            type: String,
            default: 'steelblue'
        },
        size: {
            type: Number,
            default: 4
        }
    },
    
    methods: {
        updatePlot() {
            this.resize()
                
            let bins = this.plotData.bins
            let data = this.plotData.hist
            
            // Thousands formatter: 23123 -> 23k
            let format = this.format ? d3.formatPrefix(',.0', 1e3) : d3.format('')
            
            // Setup x and y
            let x = d3.scalePoint().range([0, this.width]).domain(bins)
            let y = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(data)])
            let xAxis = d3.axisBottom(x).tickFormat(format)
            this.svg.select('.x').call(xAxis)
            
            // Remove all bars
            this.svg.selectAll('.bar').remove()
            
            // Update with new bars
            let bar = this.svg.selectAll('.bar').data(data)
            
            const rect = bar.enter().append('rect')
                .attr('class', 'bar')
                .attr('fill', this.color)
                .attr('x', (d, i) => x(bins[i]))
                .attr('y', this.height)
                .attr('width', this.width / data.length -1)
                .attr('height', 0)
            rect.transition()
                .attr('height', d => this.height - y(d))
                .attr('y', d => y(d))
            rect.append('title')
                .text(d => d)
        },
        resize() {
            this.width = $(this.$el).parent().width()
            this.width -= this.margin.left - this.margin.right
            this.height = this.width / this.size - this.margin.top - this.margin.bottom
        }
    },
    
    mounted() {
        this.resize()
        this.svg = d3.select(this.$el).select('g')
        this.updatePlot()
    },

    watch: {
        plotData() {
            this.updatePlot()
        }
    }
}
</script>

<style>
.bar {
    shape-rendering: crispEdges;
    stroke: rgba(0, 0, 0, 0.1);
}
</style>

<style scoped>
svg {
    display: block;
    width: 100%;
}
</style>