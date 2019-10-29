import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports.json'
import './index.scss'

// let svgSize = innerWidth * .65
let w = innerWidth * .75, h = w
let upperLimit = (w * .2), lowerLimit = w - (w * .2)
document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${w} height=${h} style='background-color:#ccc'></svg>
`

let origins
let destinations
let size = 4
const getJSON = async () => {
  try {
    let data = await axios.get('./json/airports.json')
    let scrambled = _.shuffle(data.data)
    origins = scrambled.slice(0, 5)
    run()
  } catch (e) { console.log(e) }
}

const run = () => {
  console.log(origins)
  let svg = document.getElementById('svg-container')
  let _x = origins.map(d => d.latitude)
  let _y = origins.map(d => d.longitude)
  // sort values to figure out the greatest among them
  let _xSorted = _x.sort((a,b) => a - b)
  let _ySorted = _y.sort((a,b) => a - b)
  // apply linearScales to our data to ensure that it fits our graph model
  let linearScaleX = d3.scaleLinear()
                             .domain([_xSorted[0], _xSorted[_xSorted.length-1]])
                             .range([lowerLimit, upperLimit])
  let linearScaleY = d3.scaleLinear()
                             .domain([_ySorted[0], _ySorted[_ySorted.length-1]])
                             .range([lowerLimit, upperLimit])

  origins.forEach(d => {
    svg.innerHTML += `
      <g>
        <circle cx=${w/2} cy=${w/2} r=${(w-4)/2} stroke='#000' fill='none'></circle>
      </g>
      <g>
        <rect x=${linearScaleX(d.latitude)} y=${linearScaleY(d.longitude)} width=${size} height=${size} fill='#000'></rect>
        <text x=${linearScaleX(d.latitude) - size} y=${linearScaleY(d.longitude) - size} font-family='arial' font-size='0.5rem' fill='#000'>
          ${d.code ? d.code : d.four_digit_code}
        </text>
        <!--
        <text x=${linearScaleX(d.latitude)} y=${linearScaleY(d.longitude) - (size*.5)} font-family='arial' font-size='0.5rem' fill='#000'>
          lat: ${parseFloat(d.latitude).toFixed(2)}, &nbsp; long:${parseFloat(d.longitude).toFixed(2)}
        </text>
        -->
      </g>
    `
  })

}

getJSON()
