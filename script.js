function inBounds(val) {
    if (val > 80) {
        console.log(`!!!!!\n${val.toFixed(2)} too high\n!!!!!`)
        return val - 20
    } else if (val < 20) {
        console.log(`!!!!!\n${val.toFixed(2)} too low\n!!!!!`)
        return val + 20
    }
    return val
}

function diffInBounds(l, diff) {
    if (l + diff > 100) {
        return l - diff
    } else if (l - diff < 0) {
        return l + diff
    } else {
        return Math.random() < .5 ? l + diff : l - diff
    }
}

let lModes = [
    'dark',
    'med',
    'light',
]

let sModes = [
    'dull',
    'med',
    'bright',
]

let lMode = 'all'
// lMode = 'dark'
lMode = 'med'
// lMode = 'light'

let sMode = 'all'
// sMode = 'dull'
sMode = 'med'
// sMode = 'bright'

let h = Math.random() * 360
let s = Math.random() * 100
let l = Math.random() * 100

if (lMode != 'all') {
    l = (l / 3) + (lModes.indexOf(lMode) * 33)
}

if (sMode != 'all') {
    s = (l / 3) + (sModes.indexOf(sMode) * 33)
}

let diff = 2

let body = document.querySelector('body')
let holder = document.getElementById('gridholder')
let tiles = document.getElementsByClassName('tile')
let paths = document.getElementsByTagName('path')
let diffTile = tiles[Math.floor(Math.random() * tiles.length)]
// let diffTile = tiles[0]

for (let i = 0; i < paths.length; i++) {
    paths[i].style.stroke = `hsl(${h},${s}%,${l}%)`
}


let bgColor = `hsl(${h + 180},${inBounds(s)}%,${inBounds(l)}%)`

body.style.backgroundColor = bgColor
holder.style.backgroundColor = bgColor
for (let i = 0; i < tiles.length; i++) {
    tiles[i].style.backgroundColor = `hsl(${h},${s}%,${l}%)`
}

diffTile.style.backgroundColor = `hsl(${h},${s}%,${diffInBounds(l,diff)}%)`
