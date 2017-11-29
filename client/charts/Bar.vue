<template>
<svg :width="width + margin.left + margin.right" :height="height + margin.top + margin.bottom">
    <g :transform="`translate(5, 20)`">
        <g class="bar-axis-top"></g>
    </g>
</svg>
</template>

<script>
import * as d3 from 'd3'

export default {
    data() {
        return {
            svg: null,
            height: 100,
            width: 100,
            y: d3.scaleBand().padding(.025),
            x: d3.scaleLinear(),
            barHeight: 40,
            margin: {top: 0, right: 5, bottom: 0, left: 5}
        }
    },

    props: ['bars'],

    methods: {
        updatePlot() {
            this.resize()
            this.x
                // .domain([0, d3.max(this.bars.map(bar => bar.count))])
                .domain([0, 100])
                .range([0, this.width - 10])
            this.y
                .domain(this.bars.map(bar => bar.bin.id))
                .rangeRound([this.height - 20, 0])

            let bars = this.svg.select('g').selectAll('g.barsG')
                .data(this.bars, bar => bar.bin.id)
            bars.exit().remove()
            let enterG = bars.enter().append('g')
                .classed('barsG', true)
            enterG.append('rect')
                .classed('bg-bar', true)
                .attr('fill', '#eee')
            enterG.append('rect')
                .classed('count-bar', true)
                .attr('fill', d => d.bin.color)
            enterG.selectAll('rect').append('title')
            let mergedG = enterG.merge(bars)
            mergedG.select('rect.bg-bar')
                .attr('width', d => this.width - 10)
            mergedG.select('rect.count-bar')
              .transition().duration(250)
                .attr('width', d => this.x((d.count / d.bin.size) * 100))
            mergedG.selectAll('rect')
                .attr('height', this.y.bandwidth())
                .attr('y', d => this.y(d.bin.id))
              .select('title')
                .text(d => `Bin ${d.bin.name}: ${d.count} contigs`)
            
            this.svg.select('.bar-axis-top')
                .transition()
                .duration(250)
                .call(d3.axisTop(this.x))
        },
        resize() {
            this.width = $(this.$el).parent().width() - this.margin.left - this.margin.right
            this.height = this.barHeight * this.bars.length
        }
    },

    mounted() {
        this.resize()
        this.svg = d3.select(this.$el)
        this.updatePlot()
    },

    watch: {
        bars() {
            this.updatePlot()
        }
    }
}
</script>