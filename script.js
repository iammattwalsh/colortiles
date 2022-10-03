const { createApp } = Vue
createApp({
    data () {
        return {
            elements: {},
            diffStart: 5,
            diffCur: 5,
            color: {
                h: 0,
                s: 0,
                l: 0,
            },
            mainColor: '',
            diffColor: '',
            bgColor: '',
            lModes: {
                dark: 0,
                med: 1,
                light: 2,
            },
            sModes: {
                dull: 0,
                med: 1,
                bright: 2,
            },
            lMode: 1,
            sMode: 1,
            numTiles: 6,
            status: 0,
            trans: 0,
            countdown: 3,
            timeLeft: 0,
            timeLeftDisp: 0,
            correct: 0,
            incorrect: 0,
            diffTile: '',
        }
    },
    created() {
    },
    mounted() {
        this.selectElements()
        this.selectDiffTile()
        this.chooseColors()
    },
    methods: {
        selectElements() {
            this.elements.body = document.querySelector('body')
            this.elements.gridHolder = document.getElementById('gridholder')
            this.elements.topBar = document.getElementById('top')
            this.elements.bottomBar = document.getElementById('bottom')
            this.elements.tiles = document.getElementsByClassName('tile')
            this.elements.paths = document.getElementsByTagName('path')
            this.elements.bars = document.getElementsByClassName('barinner')
            this.elements.timeLeft = document.getElementById('timeleft')
            this.elements.progressBar = document.getElementById('progressbar')
        },
        selectDiffTile() {
            this.diffTile = this.elements.tiles[Math.floor(Math.random() * this.numTiles)]
        },
        chooseColors() {
            this.color.h = Math.random() * 360
            this.color.s = Math.random() * 100
            this.color.l = Math.random() * 100
            if (this.sMode != 'all') {
                this.color.s = (this.color.s / 3) + (this.sMode * 33)
            }
            if (this.lMode != 'all') {
                this.color.l = (this.color.l / 3) + (this.lMode * 33)
            }
            this.mainColor = `hsl(${this.color.h},${this.color.s}%,${this.color.l}%)`
            this.bgColor = `hsl(${this.color.h + 180},${this.bgInBounds(this.color.s)}%,${this.bgInBounds(this.color.l)}%)`
            this.diffColor = `hsl(${this.color.h},${this.color.s}%,${this.diffInBounds(this.color.l)}%)`
            this.setColors()
        },
        bgInBounds(val) {
            if (val > 80) {
                return val - 20
            } else if (val < 20) {
                return val + 20
            }
            return val
        },
        diffInBounds(l) {
            if (l + this.diffCur > 100) {
                return l - this.diffCur
            } else if (l - this.diffCur < 0) {
                return l + this.diffCur
            } else {
                return Math.random() < .5 ? l + this.diffCur : l - this.diffCur
            }
        },
        setColors() {
            for (let i = 0; i < this.elements.paths.length; i++) {
                this.elements.paths[i].style.stroke = this.mainColor
            }
            
            for (let i = 0; i < this.elements.bars.length; i++) {
                this.elements.bars[i].style.color = this.mainColor
            }
            this.elements.timeLeft.style.color = this.bgColor
            this.elements.timeLeft.style.textShadow = `1px 1px ${this.mainColor}, -1px 1px ${this.mainColor}, -1px -1px ${this.mainColor}, 1px -1px ${this.mainColor}, 2px 0px ${this.mainColor}, -2px 0px ${this.mainColor}, 0px 2px ${this.mainColor}, 0px -2px ${this.mainColor}`
            this.elements.progressBar.style.backgroundColor = this.mainColor
            this.elements.body.style.backgroundColor = this.bgColor
            this.elements.topBar.style.backgroundColor = this.bgColor
            this.elements.bottomBar.style.backgroundColor = this.bgColor
            this.elements.gridHolder.style.backgroundColor = this.bgColor
            for (let i = 0; i < this.elements.tiles.length; i++) {
                this.elements.tiles[i].style.backgroundColor = this.mainColor
            }
            this.diffTile.style.backgroundColor = this.diffColor
        },




        incStatus() {
            if (this.status < 2) {
                this.trans = 1
                setTimeout(() => {
                    this.status++
                },125)
                setTimeout(() => {
                    this.trans = 0
                },250)
            } else {
                this.updateCountdown()
                this.status = 0
            }
            setTimeout(() => {
                if (this.status == 2) {
                    this.updateCountdown()
                }
            },125)
        },
        setTimeInit(selection) {
            this.timeLeft = selection
            this.timeLeftDisp = this.timeLeft + 's'
            this.incStatus()
        },
        updateCountdown() {
            this.timeLeftDisp = this.countdown
            setInterval(() => {
                if (this.countdown > 1) {
                    this.countdown--
                    this.timeLeftDisp = this.countdown
                } else {
                    this.timeLeftDisp = this.timeLeft
                }
            },1000)
        },






        reportTile(tile) {
            console.log(this.diffTile == this.elements.tiles[tile - 1])
            if (this.diffTile == this.elements.tiles[tile - 1]) {
                this.correct++
            } else {
                this.incorrect++
            }
            this.selectDiffTile()
            this.chooseColors()
        },
    }
}).mount('#app')