# ATM Crumble Js is a node tool set to make using node canvas easier.

## Crumble Js has:
1. Smooth point interpellation
2. basic line connection with variable thickness
3. "Sketchy" line connection style


## Usage (not working):
```javascript
const crumble = require('crumble');
var image = new crumble.IImange(500, 500) //width, height
var points = [
  {x:0, y:0},
  {x:250, y:250}
]
crumble.drawLine(points, 5, "black")
```

## TODO:
1. more point interpellation styles
2. "Stroke" like line connection
3. Add functionality for above usage

