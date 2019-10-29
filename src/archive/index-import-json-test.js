import * as d3 from 'd3'
import random from 'random'
import './airports.json'
import './index.scss'

document.getElementById('root').innerHTML += `
  <svg width=${innerWidth} height=${innerHeight}></svg>
`

let data
let offSetX = 900, offSetY = -100
let scale = 6
const run = () => {
  let plotPoints = d3.select('svg')
                     .selectAll('svg')
                     .data(data).enter()
                        .append('rect')
                          .attr('width', 5).attr('height', 5)
                          .attr('x', d => (scale * d.longitude) + offSetX)
                          .attr('y', d => (scale * d.latitude) + offSetY)
                          .selectAll('rect')
}
const loadData = async () => {
  data = await d3.json('./json/airports.json')
  run()
}

loadData()
