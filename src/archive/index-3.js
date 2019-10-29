import * as d3 from 'd3'
import random from 'random'
import axios from 'axios'
import _ from 'lodash'
import './airports.json'
import './index.scss'

document.getElementById('root').innerHTML += `
  <svg id='svg-container' width=${innerWidth} height=${innerHeight} style='background-color:#ccc'></svg>
`

let data
let eltW = 4, eltH = 4
let scale = 3
const getJSON = async () => {
  try {
    data = await axios.get('./json/airports.json')
    let scrambled = _.shuffle(data.data)
    data = scrambled.slice(0, 5)
    run()
  } catch (e) { console.log(e) }
}

const run = () => {
  console.log(data)
  let svg = document.getElementById('svg-container')
  let _x = data.map(d => {
    let x
    if (d.latitude < 0) x = d.latitude * -1
    if (d.latitude > 0) x = d.latitude * 2
    return x
  })
  let _y = data.map(d => {
    let y
    if (d.longitude < 0) y = d.longitude * -1
    if (d.longitude > 0) y = d.longitude * 2
    return y
  })
  let _xSorted = _x.sort((a,b) => a - b)
  let _ySorted = _y.sort((a,b) => a - b)
  console.log(_xSorted, _xSorted[_xSorted.length-1])
  console.log(_ySorted, _ySorted[_ySorted.length-1])
  data.forEach(d => {
    let x, y
    if (d.latitude < 0) {
      x = d.latitude * -1
    } else if (d.latitude > 0) {
      x = d.latitude * 2
    }
    if (d.longitude < 0) {
      y = d.longitude * -1
    } else if (d.longitude > 0) {
      y = d.longitude * 2
    }


    if (x > innerWidth) {
      x = innerWidth - (eltW * 2)
    } else {
      x = x * scale
    }
    if (y > innerHeight) {
      // console.log(y)
      y = innerHeight - (eltH * 2)
    } else {
      y = y * scale
    }

    console.log(innerHeight, y, y > innerHeight)

    x = Math.round(parseFloat(x)) //.toFixed(2)
    y = Math.round(parseFloat(y)) //.toFixed(2)

    console.log(x, y)

    svg.innerHTML += `
      <g>
        <rect x=${x} y=${y} width=${eltW} height=${eltH} fill='#000'></rect>
        <text x=${x} y=${y - eltH} font-family='arial' font-size='0.5rem' fill='#000'>${x}, &nbsp;${y}</text>
      </g>
    `
  })
  // console.log(svg.getAttribute('width'))
  let largestX = _xSorted[_xSorted.length-1]
  let largestY = _ySorted[_ySorted.length-1]
  svg.setAttribute('width', largestX * scale)
  svg.setAttribute('width', svg.getAttribute('width') * 1.5)
  // svg.setAttribute('height', largestY * scale)
  // svg.setAttribute('height', svg.getAttribute('height'))

  // console.log(svg.getAttribute('width'))
  // document.getElementById('svg-container').appendChild()

}

getJSON()
