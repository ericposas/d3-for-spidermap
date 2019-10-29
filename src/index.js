import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports.json'
import './index.scss'


let svgArea = 500
let svgMargin = 40
document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${svgArea} height=${svgArea} style='background-color:#ccc'></svg>
`

let origins
let destinations = {}
let size = 4
const getJSON = async () => {
  try {
    let data = await axios.get('./json/airports.json')
    let randomize = _.shuffle(data.data)
    origins = randomize.slice(0, 5)
    // set random set of destinations per origin
    origins.forEach(o => {
      destinations[o.code ? o.code : o.four_digit_code] = randomize.slice(0, random.int(10, 20))
    })
    console.log(origins)
    console.log(destinations)
    run()
  } catch (e) { console.log(e) }
}

const run = () => {
  let svg = document.getElementById('svg-container')
  let _x = origins.map(d => d.longitude)
  let _y = origins.map(d => d.latitude) //{ return d.latitude < 0 ? (d.latitude * -1) : (d.latitude * 2) })
  // sort values to figure out the greatest among them
  let _xSorted = _x.sort((a,b) => a - b)
  let _ySorted = _y.sort((a,b) => b - a) //.map(d => d * -1)
  console.log(
    _xSorted,
    _ySorted
  )
  // apply linearScales to our data to ensure that it fits our graph model
  let originScaleX = d3.scaleLinear()
                             .domain([_xSorted[0], _xSorted[_xSorted.length-1]])
                             .range([svgMargin, svgArea - svgMargin])
  console.log(
    _xSorted[0], _xSorted[_xSorted.length-1],
    _ySorted[0], _ySorted[_ySorted.length-1],
  )
  let originScaleY = d3.scaleLinear()
                             .domain([_ySorted[0], _ySorted[_ySorted.length-1]])
                             .range([svgMargin, svgArea - svgMargin])

  // let olat = originScaleX(d.latitude)
  // let olong = originScaleY(d.longitude)
  let olats = origins.map(d => originScaleY(d.latitude)) // y is lat, x is long
  let olongs = origins.map(d => originScaleX(d.longitude))
  origins.forEach((d,i) => {
    svg.innerHTML += `
      <!--
      <g>
        <circle cx=${400/2} cy=${400/2} r=${(400-4)/2} stroke='#000' fill='none'></circle>
      </g>
      -->
      <g>
        <circle cx=${olongs[i]} cy=${olats[i]} r=${size/2} fill='#000'></circle>
        <text x=${olongs[i] - size} y=${olats[i] - (size*5)} font-family='arial' font-size='0.5rem' fill='#000'>
          ${d.code ? d.code : d.four_digit_code}
        </text>
        <text x=${olongs[i] - size} y=${olats[i] - (size * 3)} font-family='arial' font-size='0.5rem' fill='#000'>
          lat: ${parseFloat(d.latitude).toFixed(2)}
        </text>
        <text x=${olongs[i] - size} y=${olats[i] - size} font-family='arial' font-size='0.5rem' fill='#000'>
          long:${parseFloat(d.longitude).toFixed(2)}
        </text>
      </g>
    `
  })


}

getJSON()
