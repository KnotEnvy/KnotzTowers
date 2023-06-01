const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768
c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const placementTilesData2D = []
for (let i = 0; i < placementTilesData.length; i+=20) {
    placementTilesData2D.push(placementTilesData.slice(i, i+20))
}

class PlacementTile {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.size = 64
        this.color = 'rgba(255, 255, 255, 0.25)'
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size,this.size) //tile height
    }
    update(mouse){
        this.draw()

        if (mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && mouse.y < this.position.y + this.size) {

        }
    }
}

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 14) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64
          }
        })
      )
    }
  })
})



const image = new Image()

image.onload = () => {
    animate()
}

image.src = 'images/gameMap.png'

class Enemy {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.width = 100
        this.height = 100
        this.waypointIndex = 0
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height /2
        }
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x ,this.position.y ,this.width,this.height)
    }
    update(){
        this.draw()
        
        const waypoint = waypoints[this.waypointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angle  = Math.atan2(yDistance, xDistance)
        this.position.x += Math.cos(angle)
        this.position.y += Math.sin(angle)
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height /2
        }

        if (Math.round(this.center.x) === Math.round(waypoint.x) && 
            Math.round(this.center.y) === Math.round(waypoint.y) && 
            this.waypointIndex < waypoints.length -1) {
            this.waypointIndex++
        }
    }
}

const enemies = []
for (let i = 1; i < 10; i++) {
    const xOffset = i * 150 // distance between enemies
    enemies.push(new Enemy({
        position :{x: waypoints[0].x - xOffset, y: waypoints[0].y}
    }))
}

function animate() {
    requestAnimationFrame(animate)

    c.drawImage(image, 0, 0)
    enemies.forEach(enemy => {
        enemy.update()
    })
    placementTiles.forEach((tile) => {
        tile.update(mouse)
    })
}

const mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    console.log(event)
})


// animate()