import * as d3 from 'd3'
import './index.scss'

let heirarchy = {
  "name": "data",
  "children": [
    {
      "name": "one"
    },
    {
      "name": "two",
      "children": [
        {
          "name": "two-one"
        },
        {
          "name": "two-two"
        }
      ]
    },
    {
      "name": "three"
    },
    {
      "name": "four",
      "children": [
        {
          "name": "four-one"
        },
        {
          "name": "four-two"
        },
        {
          "name": "four-three"
        },
        {
          "name": "four-four"
        }
      ]
    }
  ]
}
let data = [4234, 4343, 65756, 24, 346, 890, 8749, 47982]

let treemap = d3.treemap().size([20, 20]).padding(2)

let nodes = treemap(data)
