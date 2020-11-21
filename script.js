const gameWindow = document.getElementById('game')
const ctx = gameWindow.getContext('2d')

let eggs = []
let tickLength = 700
let elapsedTime = 0
let spawnInterval = 6
let eggSpeed = Math.PI * 2
let lastFrame = 0
let ticks = 0
let fails = 0
let gameOver = false
let score = 0
let highScore = 0
let lastEgg = 0
let preLastEgg = 1
let mouseX = 0
let mouseY = 0
let w = gameWindow.width = window.innerWidth
let h = gameWindow.height = window.innerHeight
let eggSize = Math.max(w, h) * 0.018
let slopeLength = w * 0.33
let slopeAngle = Math.PI / 16
let slopeWidth = 20
let upper = h * 0.15
let bottom = h * 0.70


class Egg {
    constructor(pos) {
        this.r = eggSize
        this.x = pos % 2 === 0 ? 0 : w 
        this.y = pos < 2 ? upper - this.r - slopeWidth / 2 : bottom - this.r - slopeWidth / 2
        this.pos = pos
        this.dir = pos % 2 === 0 ? 1 : -1
        this.rotationSpeed = eggSpeed
        this.angle = 0
        this.interval = (Math.PI * 2) / 50
        this.circ = this.r * Math.PI * 2
        this.dist = 0
        this.lifetime = 1
        this.expired = false
        this.broken = false
    }

    update(delta) {

        this.angle += this.rotationSpeed * delta
        let d = this.circ * (this.rotationSpeed * delta / (Math.PI * 2)) * this.dir
        this.x += d * Math.cos(slopeAngle)
        this.y += Math.abs(d) * Math.sin(slopeAngle)
        this.dist += Math.abs(d)

        if (this.broken) {
            this.lifetime -= 4 * delta
            if (this.lifetime <= 0) {
                this.expired = true
                this.lifetime = 0
            }
        }   
        else {
            if (this.dist >= slopeLength * 1.1) {
                if (this.pos === player.pos) {
                    this.expired = true
                    score++
                    if (score > 0 && score % 10 === 0 && tickLength > 100) {
                        tickLength -=50
                        eggSpeed += Math.PI * 0.075
                        slopeAngle += Math.PI / 400
                    } 
                    if (score > 0 && score % 25 === 0 && spawnInterval > 2) {
                        spawnInterval--
                    }
                    if (score > highScore) {
                        highScore = score
                    }
                }  
                else if (this.dist >= slopeLength * 1.15) {
                    fails++
                    this.broken = true
                    this.dist = 0
                    if (fails === 4) {
                        fails = 3
                        gameOver = true
                        localStorage.setItem('JajeczkaHighScore', highScore)
                    } 
                }
            }           
        }
    }

    show() {
        ctx.lineWidth = 0
        for(let i = 0; i < 50; i++) {
            ctx.fillStyle = `hsl(${360 * i / 50}, 65%, 50%)`
            ctx.beginPath()
            ctx.moveTo(this.x, this.y)
            ctx.lineTo(this.x + this.r * Math.cos(i * this.interval + this.angle * this.dir), this.y + this.r * Math.sin(i * this.interval + this.angle * this.dir))
            ctx.arc(this.x, this.y, this.r, i * this.interval + this.angle * this.dir, (i + this.lifetime) * this.interval + this.angle * this.dir)
            ctx.moveTo(this.x + this.r * Math.cos((i + this.lifetime) * this.interval + this.angle * this.dir), this.y + this.r * Math.sin((i + this.lifetime) * this.interval + this.angle * this.dir))
            ctx.lineTo(this.x, this.y)
            ctx.closePath()
            ctx.fill()
        }
    }
}

class Player {
    constructor(x,y) {
        this.w = Math.floor(Math.max(w, h) * 0.06)
        this.h = Math.floor(Math.max(w, h) * 0.04)
        this.pos = 0
    }

    show() {
        ctx.fillStyle = 'rgb(150, 200, 0)'
        switch(this.pos) {
            case 0:
                this.x = slopeLength * Math.cos(slopeAngle) + this.w / 5
                this.y = upper + slopeLength * Math.sin(slopeAngle)
            break

            case 1:
                this.x = w - slopeLength * Math.cos(slopeAngle) - this.w * 1.2
                this.y = upper + slopeLength * Math.sin(slopeAngle)
            break

            case 2:
                this.x = slopeLength * Math.cos(slopeAngle) + this.w / 5
                this.y = bottom + slopeLength * Math.sin(slopeAngle)
            break

            case 3:
                this.x = w - slopeLength * Math.cos(slopeAngle) - this.w * 1.2
                this.y = bottom + slopeLength * Math.sin(slopeAngle)
                break
            break
        }
        ctx.beginPath()
        ctx.arc(this.x + this.w / 2, this.y, this.w / 2, 0, Math.PI)
        ctx.fill()
    }
}

function drawField() {
    ctx.strokeStyle = 'rgb(115, 77, 38)'
    ctx.lineWidth = slopeWidth
    ctx.lineCap = 'round'

    //Left up
    ctx.beginPath()
    ctx.moveTo(0, upper)
    ctx.lineTo(slopeLength * Math.cos(slopeAngle), upper + slopeLength * Math.sin(slopeAngle))
    ctx.stroke()

    //Left Down
    ctx.beginPath()
    ctx.moveTo(0, bottom)
    ctx.lineTo(slopeLength * Math.cos(slopeAngle), bottom + slopeLength * Math.sin(slopeAngle))
    ctx.stroke()

    //Right Up
    ctx.beginPath()
    ctx.moveTo(gameWindow.width, upper)
    ctx.lineTo(gameWindow.width - slopeLength * Math.cos(slopeAngle), upper + slopeLength * Math.sin(slopeAngle))
    ctx.stroke()

    //Right Down
    ctx.beginPath()
    ctx.moveTo(gameWindow.width, bottom)
    ctx.lineTo(gameWindow.width - slopeLength * Math.cos(slopeAngle), bottom + slopeLength * Math.sin(slopeAngle))
    ctx.stroke()

    ctx.font = `${Math.floor(w * 0.02)}px Arial`
    let txt = `High Score: ${highScore}   Score: ${score}   Fails: ${fails}`
    ctx.baseline = 'bottom'
    ctx.fillStyle = 'rgb(255, 255,255)'
    ctx.fillText(txt, 10, h- 10)
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
    ctx.fillRect(0,0, w, h)
}

function mouseInBounds(mx, my, x1, y1, x2, y2) {
    return (mx > x1 && mx < x2 && my > y1 && my < y2)
}

function handleClick(e) {
    if (mouseInBounds(e.pageX, e.pageY, 0, 0, w / 5, h / 4)) {
        player.pos = 0
    }

    if (mouseInBounds(e.pageX, e.pageY, w * 0.8, 0, w, h / 4)) {
        player.pos = 1
    }

    if (mouseInBounds(e.pageX, e.pageY, 0, h * 0.75, w / 5, h)) {
        player.pos = 2
    }

    if (mouseInBounds(e.pageX, e.pageY, w * 0.8, h * 0.75, w, h)) {
        player.pos = 3
    }

    if (gameOver) {
        restart()
    }
}

function handleKeyInput(e) {
    switch(e.key) {
        case 'q':
            player.pos = 0
        break

        case 'e':
        case 'p':
            player.pos = 1
        break

        case 'a':
            player.pos = 2
        break

        case 'd':
        case 'l':
            player.pos = 3
        break
    }
}

function restart() {
    eggs = []
    tickLength = 700
    spawnInterval = 6
    eggSpeed = Math.PI * 2
    fails = 0
    score = 0
    ticks = 0
    elapsedTime = 0
    gameOver = false
    requestAnimationFrame(gameLoop)
}

function gameLoop(timestamp) {
    cls()
    let delta = timestamp - lastFrame
    lastFrame = timestamp
    elapsedTime += delta
    for (let i = eggs.length - 1; i>=0; i--) {
        eggs[i].update(delta / 1000)
        if (eggs[i].expired) {
            eggs.splice(i, 1)
        }
    }
    if (elapsedTime >= tickLength) {     
        elapsedTime = 0
        ticks++
        if (ticks % spawnInterval === 0) {
             spawnEgg()
        }
     }

    drawField()
    eggs.forEach(e => e.show())
    player.show()
    
    if (!gameOver) requestAnimationFrame(gameLoop)
    else {
        let txt = 'Game Over'
        ctx.font = `10vw Arial`
        let tw = ctx.measureText(txt).width
        ctx.baseline = 'middle'
        ctx.fillText(txt, (w - tw) / 2, h / 2)
    }
}

const player = new Player()
if (localStorage.hasOwnProperty('JajeczkaHighScore')) {
    highScore = localStorage.getItem('JajeczkaHighScore')
}

requestAnimationFrame(gameLoop)

window.addEventListener('keyup', e => handleKeyInput(e))
window.addEventListener('pointerdown', e => handleClick(e))