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
        let data = i < bins1.length ? bins1[i] : bins2[i - bins1.length]
        return { startAngle, endAngle, data, index: i }
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
                endAngle: sourceScale(d3.sum(bin.slice(0, j+1))),
                index: i,
                data: i < bins1.length ? bins1[i] : bins2[i - bins1.length]
            }
            
            // start and end angle of target bin
            let targetBin = matrix[j]
            let targetScale = scales[j]
            let target = {
                startAngle: targetScale(d3.sum(targetBin.slice(0, i))),
                endAngle: targetScale(d3.sum(targetBin.slice(0, i+1))),
                index: j,
                data: j < bins1.length ? bins1[j] : bins2[j - bins1.length]
            }
            
            ribs.push({ source, target })
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
            g: null,
            selected: null
        }
    },
    
    props: ['plotData', 'name', 'otherName', 'bins', 'otherBins'],
    
    methods: {
        fade(opacity, g) {
            this.g.selectAll('.ribbons path')
                .attr('opacity', 1)
              .filter(d => d.source.index != g.index && d.target.index != g.index)
              .transition()
                .attr('opacity', opacity)
        },
        updatePlot() {
            const width = parseInt(d3.select(this.$el).style('width'), 10)
            const height = width * .9
            const outerRadius = Math.min(width, height) * 0.5 - 40
            const outerRadiusLg = outerRadius * 1.01
            const outerRadiusSm = outerRadius * .98
            const innerRadius = outerRadius - 30
            const innerRadiusLg = innerRadius * .99
            const innerRadiusSm = innerRadius * 1.02
            
            const groupG = this.g.select('g.groups')
            const ribbonG = this.g.select('g.ribbons')
            const fade = this.fade
            
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius)
            const ribbon = d3.ribbon().radius(innerRadius-5)
            
            //--------------------------
            const chordData = chord(this.plotData.bins1, this.plotData.bins2, this.plotData.matrix)
            let selected = this.selected
                
            this.svg.select('rect#binSet1Rect')
                .attr('fill', '#a00342')
                .attr('stroke', d3.rgb('#a00342').darker())
                
            this.svg.select('rect#binSet2Rect')
                .attr('fill', '#2d0682')
                .attr('stroke', d3.rgb('#2d0682').darker())
            
            // Update groups
            let groupPaths = groupG.selectAll('path')
                .data(chordData.groups, d => d.index)
            groupPaths.exit().transition().remove()
            groupPaths.enter().append('path')
                .on('click', (d, i) => {
                    this.g.selectAll('.groups path')
                      .filter(g => g === selected)
                      .transition()
                        .attr('d', arc.innerRadius(innerRadius).outerRadius(outerRadius)) 
                    this.g.selectAll('.groups path')
                      .filter(g => g !== d)
                      .transition()
                        .attr('d', arc
                            .innerRadius(d === selected ? innerRadius : innerRadiusSm)
                            .outerRadius(d === selected ? outerRadius : outerRadiusSm)) 
                    selected = selected === d ? null : d
                    this.$emit('binSelected', selected ? this.binsMap.get(selected.data) : null)
                })
                .on('mouseover', function(d, i) { 
                    if (selected !== d) {
                        d3.select(this).transition().attr('d', arc.innerRadius(innerRadiusLg).outerRadius(outerRadiusLg)) 
                        fade(.1, d)
                    }
                })
                .on('mouseout', function(d, i) { 
                    if (selected !== d) {
                        if (selected) d3.select(this).transition().attr('d', arc.innerRadius(innerRadiusSm).outerRadius(outerRadiusSm)) 
                        else d3.select(this).transition().attr('d', arc.innerRadius(innerRadius).outerRadius(outerRadius)) 
                        selected ? fade(.1, selected) : fade(1, d)
                    }
                })
                .style("stroke", '#000000')
              .merge(groupPaths)
                .style('fill', (d, i) => this.binsMap.get(d.data).color)
              .transition()
                .attr('d', arc)
                
            // Update ribbons
            let colorScale = d3.scaleLinear().domain([0, chordData.groups.length]).range(['steelblue', 'brown'])
            let ribbonPaths = ribbonG.selectAll('path')
                .data(chordData.ribbons)
            ribbonPaths.exit().transition().remove()
            ribbonPaths.enter().append('path')
              .merge(ribbonPaths)
                .style('fill', (d, i) => this.binsMap.get(d.target.data).color)
                .style('stroke', (d, i) => d3.rgb(this.binsMap.get(d.target.data).color).darker())
              .transition()
                .attr('d', ribbon)
                
                
            //this.svg.select('defs').select('path')
            //    .attr('d', arc.innerRadius(outerRadius * 1.02).outerRadius(outerRadius * 1.03).startAngle(toRad(40)).endAngle(50))

            this.svg.select('text#name').text(this.name)
            this.svg.select('text#other-name').text(this.otherName)
        }
    },
    
    computed: {
        binsMap() {
            return d3.map([...this.bins, ...this.otherBins], bin => bin.id)
        }
    },

    watch: {
        plotData() {
            this.updatePlot()
        }
    },
    
    mounted() {
        let width = parseInt(d3.select(this.$el).style('width'), 10)
        let height = width * .9
        this.svg = d3.select(this.$el).append('svg').attr('width', width).attr('height', height)
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
            
        this.g.append('g').attr('class', 'groups')
        this.g.append('g').attr('class', 'ribbons')
        
        this.svg.append('defs').append('path').attr('id', 'curve')
            
        this.svg.selectAll('text').data(['name', 'other-name'])
          .enter().append('text')
            .attr('id', d => d)
          .append('textPath')
            .attr('xlink:href', '#curve')
            .attr('text-anchor', 'middle')
            .text(d => d)
        
        this.svg.append('rect').attr('id', 'binSet1Rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', (width / 2) * .999)
            .attr('height', height)
            .attr('fill-opacity', .1)
        this.svg.append('rect').attr('id', 'binSet2Rect')
            .attr('x', width / 2)
            .attr('y', 0)
            .attr('width', (width / 2) * .999)
            .attr('height', height)
            .attr('fill-opacity', .1)
            
        this.updatePlot()
    }
}
</script>

<style>
.ribbons {
  fill-opacity: 0.67;
}

.groups > path {
    cursor: pointer;
}

svg > rect {
    visibility: hidden;
}

svg > rect:not(:hover) {
    opacity: 0;
    transition: opacity .15s ease-in-out;
}
</style>
