<template>
<div></div>
</template>

<script>
import * as d3 from 'd3'

let toRad = (degree) => degree * (Math.PI / 180)
    
let chord = function(bins1, bins2, matrix) {
    // The bin sums are equal to the bin size
    let sumsBins1 = matrix.slice(0, bins1.length).map(x => d3.sum(x))
    let sumsBins2 = matrix.slice(bins1.length).map(x => d3.sum(x))
    // The total sum of the bins
    let sizeBins1 = d3.sum(sumsBins1)
    let sizeBins2 = d3.sum(sumsBins2)
    // Maps bin number + size to angle
    let scaleBins1 = d3.scaleLinear()
        .domain([0, sizeBins1])
        .range([toRad(5), toRad(175)])
    let scaleBins2 = d3.scaleLinear()
        .domain([0, sizeBins2])
        .range([toRad(185), toRad(355)])
    
    // Calculate start and end angle for each bin in the matrix (groups)
    let groups = matrix.map(function(bin, i) {
        let domainStart = i < bins1.length ? d3.sum(sumsBins1.slice(0, i)) : d3.sum(sumsBins2.slice(0, i - bins1.length))
        let domainEnd = i < bins1.length ? domainStart + sumsBins1[i] : domainStart + sumsBins2[i - bins1.length]
        let startAngle = i < bins1.length ? scaleBins1(domainStart) : scaleBins2(domainStart)
        let endAngle = i < bins1.length ? scaleBins1(domainEnd) : scaleBins2(domainEnd)
        if (endAngle - startAngle > 0.01) {
            startAngle += (0.01 / 2)
            endAngle -= (0.01 / 2)
        }
        return {startAngle, endAngle, data: bin, index: i}
    })
    
    // Create scales for each bin: value -> angle
    let scales = matrix.map(function(bin, i) {
        return d3.scaleLinear()
            .domain([0, d3.sum(bin)])
            .range([groups[i].startAngle, groups[i].endAngle])
    })
    
    // Calculate angles for the ribbons
    let ribbons = []
    matrix.forEach(function(bin, i) {
        let sourceScale = scales[i]
        let ribs = bin.reduce(function(ribs, size, j) { 
            if (size == 0) return ribs
            
            // start and end angle of source bin
            let source = {
                startAngle: sourceScale(d3.sum(bin.slice(0, j))),
                endAngle: sourceScale(d3.sum(bin.slice(0, j+1)))
            }
            
            // start and end angle of target bin
            let targetBin = matrix[j]
            let targetScale = scales[j]
            let target = {
                startAngle: targetScale(d3.sum(targetBin.slice(0, i))),
                endAngle: targetScale(d3.sum(targetBin.slice(0, i+1)))
            }
            
            ribs.push({source, target})
            return ribs
        }, [])
        ribbons.push(...ribs)
    })
    
    return {groups, ribbons}
}

export default {
    data() {
        return {
            svg: null,
            g: null
        }
    },
    
    props: {
        plotData: {
            type: Object,
            default: function () {
                return { bins1: [], bins2: [], matrix: [] }
            }
        }
    },
    
    methods: {
        updatePlot: function() {
            let width = parseInt(d3.select(this.$el).style('width'), 10)
            let height = width
            let outerRadius = Math.min(width, height) * 0.5 - 40
            let innerRadius = outerRadius - 30
            let groupG = this.g.select('g.groups')
            let ribbonG = this.g.select('g.ribbons')
            
            let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
            let ribbon = d3.ribbon().radius(innerRadius-5)
            
            //--------------------------
            let chordData = chord(this.plotData.bins1, this.plotData.bins2, this.plotData.matrix)
            
            let groupPaths = groupG.selectAll('path').data(chordData.groups, d => d.index)
            groupPaths.enter().append('path')
                //.style('fill', d => indexToBin(d.index).color)
                .style('fill', (d, i) => d3.scaleLinear().domain([0, chordData.groups.length]).range(['brown', 'steelblue'])(i))
                .style("stroke", '#000000')
                .attr('d', arc);
                
            let ribbonPaths = ribbonG.selectAll('path').data(chordData.ribbons)
            let colorScale = d3.scaleLinear().domain([0, chordData.groups.length]).range(['steelblue', 'brown'])
            ribbonPaths.enter().append('path')
                .style('fill', (d, i) => colorScale(i))
                .style('stroke', (d, i) => d3.rgb(colorScale(i)).darker())
                .attr('d', ribbon)
        }
    },
    
    mounted: function() {
        let width = parseInt(d3.select(this.$el).style('width'), 10)
        let height = width
        let outerRadius = Math.min(width, height) * 0.5 - 40
        let innerRadius = outerRadius - 30
        this.svg = d3.select(this.$el).append('svg').attr('width', width).attr('height', height)
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            
        this.g.append('g').attr('class', 'groups')
        this.g.append('g').attr('class', 'ribbons')
            
        this.updatePlot()
    },

    updated: function() {
        console.log('update')
        this.updatePlot()
    }
}
</script>

<style>
.ribbons {
  fill-opacity: 0.67;
}
</style>
