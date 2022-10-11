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
            countdown: 3,
            gameLength: 1,
            timeLeft: 1,
            correct: 0,
            incorrect: 0,
            diffTile: '',
            gameActive: 0,
            status: 0,
            trans: 0,
            statLastGame: {
                perc: 0,
                correct: 0,
                incorrect: 0,
            },
            statBestGame: {
                perc: 0,
                correct: 0,
                incorrect: 0,
            },
        }
    },
    created() {
        if (localStorage.getItem('lastGame')) {
            this.statLastGame = JSON.parse(localStorage.getItem('lastGame'))
        }
        if (localStorage.getItem('bestGame')) {
            this.statBestGame = JSON.parse(localStorage.getItem('bestGame'))
        }
    },
    mounted() {
        this.selectElements()
        this.selectDiffTile()
        this.chooseColors()
    },
    methods: {
        selectElements() {
            this.elements.body = document.querySelector('body')
            this.elements.midHolder = document.getElementById('midholder')
            this.elements.topBar = document.getElementById('top')
            this.elements.bottomBar = document.getElementById('bottom')
            this.elements.tiles = document.getElementsByClassName('tile')
            this.elements.paths = document.getElementsByTagName('path')
            this.elements.bars = document.getElementsByClassName('barinner')
            this.elements.timeLeft = document.getElementById('timeleftp')
            this.elements.progressBar = document.getElementById('progressbar')
            this.elements.pTags = document.getElementsByTagName('p')
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
            for (let i = 0; i < this.elements.pTags.length; i++) {
                this.elements.pTags[i].style.color = this.mainColor
            }

            this.elements.timeLeft.style.color = this.bgColor
            this.elements.timeLeft.style.textShadow = `1px 1px ${this.mainColor}, -1px 1px ${this.mainColor}, -1px -1px ${this.mainColor}, 1px -1px ${this.mainColor}, 2px 0px ${this.mainColor}, -2px 0px ${this.mainColor}, 0px 2px ${this.mainColor}, 0px -2px ${this.mainColor}`
            this.elements.progressBar.style.backgroundColor = this.mainColor
            this.elements.body.style.backgroundColor = this.bgColor
            this.elements.topBar.style.backgroundColor = this.bgColor
            this.elements.bottomBar.style.backgroundColor = this.bgColor
            this.elements.midHolder.style.backgroundColor = this.bgColor
            for (let i = 0; i < this.elements.tiles.length; i++) {
                this.elements.tiles[i].style.backgroundColor = this.mainColor
            }
            this.diffTile.style.backgroundColor = this.diffColor
        },
        selectGameTime(selection) {
            this.gameLength = selection
            this.timeLeft = selection
            this.trans = 1
            setTimeout(() => {
                this.status = 1
                this.trans = 0
                this.runGameCountdown()
            }, 250)
        },
        runGameCountdown() {
            this.countdown = 3
            this.chooseColors()
            let countdownInterval = setInterval(() => {
                if (this.countdown > 1) {
                    this.chooseColors()
                    this.countdown--
                } else {
                    this.trans = 1
                    clearInterval(countdownInterval)
                    this.startGame()
                }
            },1000)
        },
        startGame() {
            this.diffCur = this.diffStart
            this.correct = 0
            this.incorrect = 0
            this.chooseColors()
            setTimeout(() => {
                this.gameActive = 1
                this.status = 2
                this.trans = 0
                this.runGame()
            }, 250)
        },
        runGame() {
            this.elements.progressBar.style.width = `${(this.timeLeft / this.gameLength) * 100}%`
            let gameInterval = setInterval(() => {
                if (this.timeLeft > 1) {
                    this.timeLeft--
                    this.elements.progressBar.style.width = `${(this.timeLeft / this.gameLength) * 100}%`
                } else {
                    clearInterval(gameInterval)
                    this.trans = 1
                    this.endGame()
                }
            },1000)
        },
        endGame() {
            this.calcStats()
            setTimeout(() => {
                this.gameActive = 0
                this.status = 0
                this.trans = 0
            }, 250)
        },
        calcStats() {
            this.statLastGame.correct = this.correct
            this.statLastGame.incorrect = this.incorrect
            if (this.correct > 0 && this.incorrect > 0) {
                this.statLastGame.perc = Math.round((this.correct / (this.correct + this.incorrect)) * 100)
            } else {
                this.statLastGame.perc = 0
            }
            if (this.statLastGame.perc > this.statBestGame.perc || (this.statLastGame.perc == this.statBestGame.perc && this.statLastGame.correct > this.statBestGame.correct)) {
                this.statBestGame.correct = this.correct
                this.statBestGame.incorrect = this.incorrect
                if (this.correct > 0 && this.incorrect > 0) {
                    this.statBestGame.perc = Math.round((this.correct / (this.correct + this.incorrect)) * 100)
                } else {
                    this.statBestGame.perc = 0
                }
            }
            this.saveToLocal()
        },
        saveToLocal () {
            const parsedLastGame = JSON.stringify(this.statLastGame)
            localStorage.setItem('lastGame', parsedLastGame)
            const parsedBestGame = JSON.stringify(this.statBestGame)
            localStorage.setItem('bestGame', parsedBestGame)
        },
        reportTile(tile) {
            if (this.diffTile == this.elements.tiles[tile - 1]) {
                this.correct++
                this.diffCur *= .95
            } else {
                this.incorrect++
            }
            this.selectDiffTile()
            this.chooseColors()
        },
    }
}).mount('#app')