const gameWindow = document.getElementById('game')
const ctx = gameWindow.getContext('2d')
const eggs = []

let tickLength = 700
let elapsedTime = 0
let spawnInterval = 6
let eggSpeed = Math.PI * 2
let lastFrame = 0
let ticks = 0
let gameOver = false
let score = 0
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
        this.steps = 0
        this.rotationSpeed = eggSpeed
        this.angle = 0
        this.interval = (Math.PI * 2) / 50
        this.circ = this.r * Math.PI * 2
        this.dist = 0
    }

    update(delta) {
        if (!this.caught) {
            this.angle += this.rotationSpeed * delta
            let d = this.circ * (this.rotationSpeed * delta / (Math.PI * 2)) * this.dir
            this.x += d * Math.cos(slopeAngle)
            this.y += Math.abs(d) * Math.sin(slopeAngle)
            this.dist += Math.abs(d)
            
            if (this.dist >= slopeLength * 1.1) {
                if (this.pos != player.pos) {
                    gameOver = true
                }  
                else {
                    this.caught = true
                    score++
                    if (score > 0 && score % 10 === 0 && tickLength > 100) {
                        tickLength -=50
                        eggSpeed += Math.PI * 0.075
                        slopeAngle += Math.PI / 400
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
        let i = 0
        ctx.strokeStyle = `rgb(${i}, 0, 0)`
        ctx.lineWidth = 0
            for(i = 0; i < 50; i++) {
                ctx.fillStyle = `hsl(${360 * i / 50}, 80%, 50%)`
                ctx.beginPath()
                ctx.moveTo(this.x, this.y)
                ctx.lineTo(this.x + this.r * Math.cos(i * this.interval + this.angle * this.dir), this.y + this.r * Math.sin(i * this.interval + this.angle * this.dir))
                ctx.arc(this.x, this.y, this.r, i * this.interval + this.angle * this.dir, (i + 1) * this.interval + this.angle * this.dir)
                ctx.moveTo(this.x + this.r * Math.cos((i+1) * this.interval + this.angle * this.dir), this.y + this.r * Math.sin((i+1) * this.interval + this.angle * this.dir))
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
        //ctx.fillRect(this.x, this.y, this.w, this.h)
        ctx.beginPath()
        ctx.arc(this.x + this.w / 2, this.y, this.w / 2, 0, Math.PI)
        ctx.fill()
    }
}

function drawField() {
    ctx.strokeStyle = 'rgb(115, 77, 38)'
    ctx.lineWidth = slopeWidth

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
    ctx.fillRect(0,0, w, h)
}

function mouseInBounds(x1, y1, x2, y2) {
    return (mouseX > x1 && mouseX < x2 && mouseY > y1 && mouseY < y2)
}

function handleClick(e) {
    mouseX = e.pageX
    mouseY = e.pageY

    if (mouseInBounds(slopeLength * Math.cos(slopeAngle) + player.w / 5, upper + slopeLength * Math.sin(slopeAngle) ,
    slopeLength * Math.cos(slopeAngle) + player.w * 1.2, upper + slopeLength * Math.sin(slopeAngle) + player.h * 1.2)) {
        player.pos = 0
    }


    if (mouseInBounds(w - slopeLength * Math.cos(slopeAngle) - player.w * 1.2, upper + slopeLength * Math.sin(slopeAngle) ,
    w - slopeLength * Math.cos(slopeAngle) - player.w / 5, upper + slopeLength * Math.sin(slopeAngle) + player.h * 1.2)) {
        player.pos = 1
    }

    if (mouseInBounds(slopeLength * Math.cos(slopeAngle) + player.w / 5, bottom + slopeLength * Math.sin(slopeAngle) ,
    slopeLength * Math.cos(slopeAngle) + player.w * 1.2, bottom + slopeLength * Math.sin(slopeAngle) + player.h * 1.2)) {
        player.pos = 2
    }

    if (mouseInBounds(w - slopeLength * Math.cos(slopeAngle) - player.w * 1.2, bottom + slopeLength * Math.sin(slopeAngle) ,
    w - slopeLength * Math.cos(slopeAngle) - player.w / 5, bottom + slopeLength * Math.sin(slopeAngle) + player.h * 1.2)) {
        player.pos = 3
    }

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

}

const player = new Player()

requestAnimationFrame(gameLoop)

window.addEventListener('keyup', e => handleKeyInput(e))
window.addEventListener('pointerdown', e => handleClick(e))