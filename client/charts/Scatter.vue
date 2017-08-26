<template>
<svg :width="width" :height="height" style="display: block">
    <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0.0%" stop-color="#f00"></stop>
            <stop offset="100.0%" stop-color="#00f"></stop>
        </linearGradient>
    </defs>
    <g class="legend" :transform="`translate(${width},0)`">
        <g transform="translate(-25,20)">
            <text text-anchor="start" x="-60">Length (kbp)</text>

            <circle r="10" cx="0" cy="20" fill="#ccc" stroke="black" opacity=".6"></circle>
            <text text-anchor="end" x="-15" y="25">200</text>

            <circle r="8" cx="0" cy="40" fill="#ccc" stroke="black" opacity=".6"></circle>
            <text text-anchor="end" x="-15" y="45">50</text>

            <circle r="4" cx="0" cy="60" fill="#ccc" stroke="black" opacity=".6"></circle>
            <text text-anchor="end" x="-15" y="65">10</text>
        </g>
        <g v-show="colorBy === 'gc'" transform="translate(-10, 120)">
            <text text-anchor="start" x="-45">GC (%)</text>
            <rect 
                :width="20" 
                :height="50" 
                :y="10" :x="-30" 
                class="color-legend">
            </rect>
            <line x1="-30" y1="10" x2="-30" y2="60" stroke="#333"></line>
            <line x1="-30" y1="11" x2="-35" y2="11" stroke="#333"></line>
            <text text-anchor="end" x="-40" y="15" font-size="12">.75</text>
            <line x1="-30" y1="35" x2="-35" y2="35" stroke="#333"></line>
            <text text-anchor="end" x="-40" y="39" font-size="12">.5</text>
            <line x1="-30" y1="59" x2="-35" y2="59" stroke="#333"></line>
            <text text-anchor="end" x="-40" y="63" font-size="12">.25</text>
            <!-- <g class="axis" id="legend-axis" transform="translate(-30, 10)"></g> -->
        </g>
        <g transform="translate(-25, 120)" v-show="colorBy !== 'gc'">
            <text text-anchor="start" x="-15">Bin</text>
            <g v-for="(bin, i) in $store.state.refineBins" 
                :key="bin.id"
                :style="{ cursor: 'pointer' }"
                :transform="`translate(0,${i*20+15})`"
                @click="selectBinContigs(bin.id)">
                <circle r="6" cx="0" cy="0" :fill="bin.color"></circle>
                <text :x="-10" y="5" text-anchor="end">{{ bin.name }}</text>
            </g>
        </g>
    </g>
    <g class="x axis" :transform="`translate(0,${height})`"></g>
    <g class="y axis" :transform="'translate(0,0)'"></g>
    <g id="hulls"></g>
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
            zoomTransform: null,
            selectionSets: []
        }
    },

    props: [
        'xData',
        'yData',
        'xLog',
        'yLog',
        'colorBy',
        'colorBinSet'
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

            this.updateHulls()
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
            this.svg.select('g#hulls').selectAll('polygon')
                .attr('transform', d3.event.transform)
            this.zoomTransform = d3.event.transform
        },
        lassoStarted() {
        },
        lassoDrawing() {
            this.lasso.possibleItems()
                .classed('not_possible', false)
                .classed('possible', true)

            this.lasso.notPossibleItems()
                .filter(c => this.selectedIds.includes(c.id))
                .classed('not_possible', true)
                .classed('possible', false)
        },
        lassoEnded() {
            this.lasso.items()
                .classed('not_possible', false)
                .classed('possible', false);

            this.lasso.selectedItems()
                .classed('selected', true)

            const [startIndex, endIndex] = this.selectContigs(this.lasso.selectedItems().data())
            if (startIndex < endIndex)
                this.selectionSets.push([startIndex, endIndex])
            this.updateHulls()
        },
        selectContigs(contigs) {
            const selected = contigs.filter(c => !this.selectedIds.includes(c.id))
            const all = [...this.selectedContigs, ...selected]
            const startIndex = this.selectedContigs.length
            this.$store.commit('SET_SELECTED_CONTIGS', all)
            const endIndex = this.selectedContigs.length
            this.lasso.items()
                .filter(c => this.selectedIds.includes(c.id))
                .classed('selected', true)
            return [startIndex, endIndex]
        },
        updateHulls() {
            const hull = this.svg.select('g#hulls').selectAll('polygon.hull')
                .data(this.selectionSets)
            hull.exit().remove()
            hull.enter().append('polygon')
                .classed('hull', true)
              .merge(hull)
                .attr('transform', this.zoomTransform)
              .transition()
                .attr('points', d => {
                    const dots = this.selectedContigs.slice(d[0], d[1])
                        .map(d => [this.x(d[this.xData]), this.y(d[this.yData])])
                    if (dots.length > 2)
                        return d3.polygonHull(dots).join(' ')
                    return dots.map(x => x.join(',')).join(' ')
                })
        },
        selectBinContigs(binId) {
            this.selectContigs(this.contigs.filter(c => c.bin === binId))
        }
    },

    mounted() {
        this.resize()
        this.svg = d3.select(this.$el)

        this.colorScale = d3.scaleLinear()
            .domain([0.25, 0.75])
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
        this.svg.on('contextmenu', () => {
            d3.event.preventDefault()
            this.selectionSets = []
            this.updateHulls()
            this.lasso.items()
                .classed('not_possible', true)
                .classed('possible selected', false)
            this.$store.commit('SET_SELECTED_CONTIGS', [])
        })

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
}

.legend circle {
    stroke: black;
    stroke-width: .5;
}

polygon.hull {
    fill: #ccc;
    stroke: #ccc;
    opacity: .5;
    stroke-width: 12px;
    stroke-linejoin: round;
    fill-rule: nonzero;
}
</style>