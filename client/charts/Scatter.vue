<template>
<svg :width="width" :height="height" style="display: block">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0.0%" stop-color="#f00"></stop>
            <stop offset="100.0%" stop-color="#00f"></stop>
        </linearGradient>
    </defs>
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
    <polygon id="hull"></polygon>
    <g id="circles"></g>
</svg>
</template>

<script>
import { lasso } from 'd3-lasso'
import * as d3 from 'd3'
import { mapState } from 'vuex'

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
            sizeScale: null,
            hull: null,
            zoomTransform: null
        }
    },

    props: [
        'xData',
        'yData',
        'xLog',
        'yLog',
        'colorBy',
        'colorBinSet',
        'expand'
    ],
    
    methods: {
        updatePlot() {
            this.resize()

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
            this.svg.select('g#legend-axis').call(this.legendAxis)

            const circle = this.svg.selectAll('circle.dot')
                .data(this.contigs, contig => contig.id)

            circle.exit().transition()
                .attr('r', 0)
                .remove()

            const circleEnter = circle.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', 0)
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))
                .style('opacity', .5)
                .attr('transform', this.zoomTransform ? this.zoomTransform : null)

            circleEnter.merge(circle).transition()
                .attr('cx', contig => this.x(contig[this.xData]))
                .attr('cy', contig => this.y(contig[this.yData]))
                .attr('r', contig => this.sizeScale(contig.length))
                .attr('fill', contig => {
                    if (this.colorBy === 'gc') return this.colorScale(contig.gc)
                    return contig[`color_${this.colorBinSet}`]
                })

            this.lasso.items(circleEnter.merge(circle))
            this.updateHull()
        },
        resize() {
            this.height = $('.app-right').height()
            this.width = $('.app-right').width()
        },
        zoomed() {
            this.svg.select('g.x')
                .call(this.xAxis.scale(d3.event.transform.rescaleX(this.x)))
            this.svg.select('g.y')
                .call(this.yAxis.scale(d3.event.transform.rescaleY(this.y)))
            this.svg.selectAll('circle.dot')
                .attr('transform', d3.event.transform)
            this.hull.attr('transform', d3.event.transform)
            this.zoomTransform = d3.event.transform
        },
        lassoStarted() {
            let items = this.lasso.items()
                .classed('not_possible', true)
            if (!this.expand) {
                this.$store.commit('SET_SELECTED_CONTIGS', [])
                this.updateHull()
                items.classed('selected', false)
            }
        },
        lassoDrawing() {
            this.lasso.possibleItems()
                .classed('not_possible', false)
                .classed('possible', true)

            let notPossible = this.lasso.notPossibleItems()
            if (this.expand) 
                notPossible = notPossible.filter(c => this.selectedIds.includes(c.id))
            notPossible
                .classed('not_possible', true)
                .classed('possible', false)
        },
        lassoEnded() {
            this.lasso.items()
                .classed('not_possible', false)
                .classed('possible', false);

            this.lasso.selectedItems()
                .classed('selected', true)

            let selected = this.lasso.selectedItems().data()
            selected = [...selected, ...this.selectedContigs]
                .filter((elt, i, a) => i === a.findIndex(elt2 => elt.id === elt2.id))
            this.$store.commit('SET_SELECTED_CONTIGS', selected)

            this.updateHull()
        },
        updateHull() {
            const dots = this.selectedContigs
                .map(d => [this.x(d[this.xData]), this.y(d[this.yData])])
            const hullPoints = d3.polygonHull(dots) || []
            this.hull.transition().attr('points', hullPoints.join(' '))
        }
    },

    mounted() {
        this.resize()
        this.svg = d3.select(this.$el)
        this.hull = this.svg.select('polygon#hull')

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
        window.onresize = this.updatePlot
    },

    computed: {
        binSet() {
            return this.$store.state.binSet.id
        },
        selectedIds() {
            return this.selectedContigs.map(c => c.id)
        },
        ...mapState([
            'contigs',
            'refineBinSet',
            'selectedContigs'
        ])
    },

    watch: {
        '$route': 'updatePlot',
        'contigs': 'updatePlot',
        'xData': 'updatePlot',
        'yData': 'updatePlot',
        'colorBy': 'updatePlot',
        'colorBinSet': 'updatePlot',
        'xLog': 'updatePlot',
        'yLog': 'updatePlot'
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
    stroke: rgb(80, 80, 80);
    stroke-width: 2px;
}

.lasso .drawn {
    fill-opacity: .05;
}

.lasso .loop_close {
    fill: none;
    stroke-dasharray: 4,4;
}

.lasso .origin {
    fill: #3399FF;
    fill-opacity: .5;
}

.not_possible {
}

.possible {
    opacity: 1 !important;
}

.selected {
    opacity: 1 !important;
}

.color-legend {
    fill: url(#gradient);
    opacity: .8;
    /*stroke: #000;*/
}

.legend circle {
    stroke: black;
    stroke-width: .5;
}

polygon#hull {
    fill: #ccc;
    stroke: #ccc;
    opacity: .5;
    stroke-width: 12px;
    stroke-linejoin: round;
}
</style>