<template>
<div>
    <svg :width="width" :height="height">
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0.0%" stop-color="#f00"></stop>
                <stop offset="100.0%" stop-color="#00f"></stop>
            </linearGradient>
        </defs>
        <g id="legend" v-show="colorBy === 'gc' && showLegend">
            <g class="axis" :transform="`translate(${width-30},10)`"></g>
            <rect 
                :width="20" 
                :height="height / 8" 
                :y="10" :x="width - 30" 
                id="color-legend">
            </rect>
        </g>
        <g class="x axis" :transform="`translate(0,${height})`"></g>
        <g class="y axis" :transform="'translate(0,0)'"></g>
    </svg>
</div>
</template>

<script>
import { lasso } from 'd3-lasso'
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            zoom: null,
            lasso: null,
            x: null,
            y: null,
            xAxis: null,
            yAxis: null,
            legendAxis: null,
            legendScale: null,
            height: 100,
            width: 100,
            colorScale: null,
            sizeScale: null
        }
    },
    
    props: [
        'contigs', 
        'xData', 
        'yData', 
        'colorBy', 
        'colorBinSet', 
        'showLegend',
        'xLog',
        'yLog'
    ],
    
    methods: {
        updatePlot() {
            this.x = this.xLog ? d3.scaleLog() : d3.scaleLinear()
            this.x.domain([d3.min(this.contigs, c => c[this.xData]), d3.max(this.contigs, c => c[this.xData])])
                .range([0, this.width])
                
            this.y = this.yLog ? d3.scaleLog() : d3.scaleLinear()
            this.y.domain([d3.min(this.contigs, c => c[this.yData]), d3.max(this.contigs, c=> c[this.yData])])
                .range([0, this.height])
            
            this.legendScale = d3.scaleLinear()
                .domain([0.7, 0.3])
                .range([0, this.height / 8])

            this.xAxis = d3.axisTop(this.x).ticks(12)
            this.yAxis = d3.axisRight(this.y).ticks(12 * this.height / this.width)
            this.legendAxis = d3.axisLeft(this.legendScale)
                .tickValues([0.3, 0.5, 0.7])

            this.svg.select('g.x').call(this.xAxis)
            this.svg.select('g.y').call(this.yAxis)
            this.svg.select('g#legend g.axis').call(this.legendAxis)

            const circle = this.svg.selectAll('circle')
                .data(this.contigs, function c() { return c.id })

            circle.transition()
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))

            circle.exit().transition()
                .attr('r', 0)
                .remove()

            const circleEnter = circle.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', 0)
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))
                .attr('fill', contig => {
                    if (this.colorBy === 'gc') return this.colorScale(contig.gc)
                    return contig[`color_${this.colorBinSet}`]
                })
                .style('opacity', .5)
            circleEnter.transition()
                .attr('r', contig => this.sizeScale(contig.length))

            this.lasso.items(circleEnter)
        },
        zoomed() {
            this.svg.select('g.x')
                .call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
            this.svg.select('g.y')
                .call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))
            this.svg.selectAll('circle.dot')
                .attr('transform', d3.event.transform)
        },
        lassoStarted() {
            this.lasso.items()
                .classed('not_possible', true)
                .classed('selected', false)
        },
        lassoDrawing() {
            this.lasso.possibleItems()
                .classed('not_possible', false)
                .classed('possible', true)

            this.lasso.notPossibleItems()
                .classed('not_possible', true)
                .classed('possible', false)
        },
        lassoEnded() {
            this.lasso.items()
                .classed('not_possible', false)
                .classed('possible', false);

            this.lasso.selectedItems()
                .classed('selected', true)

            this.$emit('selected', this.lasso.selectedItems().data())
        }
    },

    mounted() {
        this.width = parseInt(d3.select(this.$el).style('width'), 10)
        this.height = this.width * .8
        this.svg = d3.select(this.$el).select('svg')

        this.colorScale = d3.scaleLinear()
            .domain([0.3, 0.7])
            .range(['blue', 'red'])

        this.sizeScale = d3.scaleLog()
            .clamp(true)
            .domain([10000, 200000])
            .range([4, 10])
        
        this.zoom = d3.zoom()
            .scaleExtent([.5, 5])
            .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
            .on('start', null)
            .on('zoom', this.zoomed);

        this.lasso = lasso()
            .targetArea(this.svg)
            .on('start', this.lassoStarted)
            .on('draw', this.lassoDrawing)
            .on('end', this.lassoEnded)

        this.svg.call(this.lasso)
        this.svg.call(this.zoom)

        this.updatePlot()
    },

    computed: {
        binSet() {
            return this.$store.state.binSet.id
        }
    },

    watch: {
        contigs() { this.updatePlot() },
        xData() { this.updatePlot() },
        yData() { this.updatePlot() },
        colorBy() { this.updatePlot() },
        colorBinSet() { this.updatePlot() },
        xLog() { this.updatePlot() },
        yLog() { this.updatePlot() }
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

.dot {
    stroke: black;
    stroke-width: .5;
}

.lasso path {
    stroke: rgb(80,80,80);
    stroke-width:2px;
}

.lasso .drawn {
    fill-opacity:.05 ;
}

.lasso .loop_close {
    fill:none;
    stroke-dasharray: 4,4;
}

.lasso .origin {
    fill:#3399FF;
    fill-opacity:.5;
}

.not_possible {
}

.possible {
    opacity: 1 !important;
}

.selected {
    opacity: 1 !important;
}

#color-legend {
    fill: url(#gradient);
    opacity: .8;
    /*stroke: #000;*/
}
</style>