const gameWindow = document.getElementById('game')
const ctx = gameWindow.getContext('2d')
const eggs = []

let tickLength = 700
let elapsedTime = 0
let spawnInterval = 6
let lastFrame = 0
let ticks = 0
let gameOver = false
let score = 0
let lastEgg = 0
let preLastEgg = 1
const moveDist = 100

class Egg {
    constructor(pos) {
        this.x = pos % 2 === 0 ? 30 - moveDist : gameWindow.width - 30 + moveDist
        this.y = pos < 2 ? 100 : gameWindow.height - 100
        this.r = 30
        this.pos = pos
        this.dir = pos % 2 === 0 ? 1 : -1
        this.steps = 0
    }

    update() {
        if (!this.caught) {
            this.steps++
            this.x += moveDist * this.dir
            if (this.steps === 6) {
                if (this.pos != player.pos) {
                    gameOver = true
                }
                else {
                    this.caught = true
                    score++
                    if (score > 0 && score % 10 === 0 && tickLength > 100) {
                        tickLength -=50
                    } 
                    if (score > 0 && score % 25 === 0 && spawnInterval > 2) {
                        spawnInterval--
                    }
                }
            }
        }
        else {
            this.expired = true
        }

    }

    show() {
        ctx.fillStyle = 'rgb(200, 0, 0)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fill()
    }
}

class Player {
    constructor(x,y) {
        this.w = 90
        this.h = 60
        this.pos = 0
    }

    show() {
        ctx.fillStyle = 'rgb(0, 200, 0)'
        switch(this.pos) {
            case 0:
                this.x = 6 * moveDist - this.w
                this.y = 100 - this.h / 2
            break

            case 1:
                this.x = gameWindow.width - 6 * moveDist
                this.y = 100 - this.h / 2
            break

            case 2:
                this.x = 6 * moveDist - this.w
                this.y = gameWindow.height - 100 - this.h / 2
            break

            case 3:
                this.x = gameWindow.width - 6 * moveDist
                this.y = gameWindow.height - 100 - this.h / 2
            break
        }
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
}

function drawField() {
    ctx.strokeStyle = 'rgb(150, 150, 0)'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(0, 130)
    ctx.lineTo(5 * moveDist, 130)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, gameWindow.height - 70)
    ctx.lineTo(5 * moveDist, gameWindow.height - 70)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(gameWindow.width, 130)
    ctx.lineTo(gameWindow.width - 5 * moveDist, 130)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(gameWindow.width, gameWindow.height - 70)
    ctx.lineTo(gameWindow.width - 5 * moveDist, gameWindow.height - 70)
    ctx.stroke()

    ctx.font = `${Math.floor(gameWindow.width * 0.02)}px Arial`
    let txt = `Score: ${score}`
    let w = ctx.measureText(txt).width
    ctx.baseline = 'middle'
    ctx.fillStyle = 'rgb(255, 255,255)'
    ctx.fillText(txt, (gameWindow.width - w) / 2, gameWindow.height / 2)
}

function spawnEgg() {
    let p = Math.floor(Math.random() * 4)
    while (preLastEgg == lastEgg && p == lastEgg) {
        p = Math.floor(Math.random() * 4) 
    }
    preLastEgg = lastEgg
    lastEgg = p
    let e = new Egg(p)
    eggs.push(e)
}

function cls() {
    ctx.fillStyle = 'rgb(21, 21, 21)'
    ctx.fillRect(0,0, 1600, 800)
}

function handleKeyInput(e) {
    switch(e.key) {
        case 'q':
            player.pos = 0
        break

        case 'e':
            player.pos = 1
        break

        case 'a':
            player.pos = 2
        break

        case 'd':
            player.pos = 3
        break
    }
}

function gameLoop(timestamp) {
    cls()
    let delta = timestamp - lastFrame
    lastFrame = timestamp
    elapsedTime += delta
    if (elapsedTime >= tickLength) {
        
        elapsedTime = 0
        ticks++
        if (ticks % spawnInterval === 0) {
            spawnEgg()
        }
        for (let i = eggs.length - 1; i>=0; i--) {
            eggs[i].update()
            if (eggs[i].expired) {
                eggs.splice(i, 1)
            }
        }
    }


    drawField()
    player.show()
    eggs.forEach(e => e.show())
    if (!gameOver) requestAnimationFrame(gameLoop)

}

const player = new Player()
gameWindow.width = 1600 
gameWindow.height = 800
requestAnimationFrame(gameLoop)

window.addEventListener('keyup', e => handleKeyInput(e))