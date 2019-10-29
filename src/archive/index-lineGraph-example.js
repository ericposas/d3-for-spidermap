import * as d3 from 'd3'
import random from 'random'
import './index.scss'

document.getElementById('root')
        .innerHTML += `<svg class='container' width=${innerWidth} height=${innerHeight}></svg>`
let d = []
let upperLimit = 400
for (let i = 0; i < 50; i++)
  d.push({ x: i * 20, y: random.int(0, upperLimit) })
let d_less = d.slice(0, 10)

let lineFunction = d3.line()
                     .curve(d3.curveCatmullRom)
                     .x(d => d.x)
                     .y(d => d.y)

let lineGraph = d3.select('.container')
                  .append('path')
                  .attr('d', lineFunction(d))
                  .attr('stroke', 'blue')
                  .attr('stroke-width', '2')
                  .attr('fill', 'none')
