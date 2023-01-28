const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //c = context

canvas.width = 1024
canvas.height = 576
const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const collisionBlocks = []
const collisions = []
for (let i = 0; i < COLLISIONS.length; i += 36){
    collisions.push(COLLISIONS.slice(i, i + 36))
}
collisions.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 202){
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            )
        }
    })
})


const platformCollisionBlocks = []
const platformCollisions = []
for (let i = 0; i < PLATFORM_COLLISIONS.length; i += 36){
    platformCollisions.push(PLATFORM_COLLISIONS.slice(i, i + 36))
}
platformCollisions.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 78 || symbol === 80 || symbol === 81 || symbol === 82){
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            )
        }
    })
})



const gravity = 0.5

const player = new Player({    
    position: {
        x: 100,
        y: 0,
    },
    collisionBlocks, // same as cB = cB
})

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)


    c.save()

    c.scale(4, 4) 
    c.translate(0, -background.image.height + scaledCanvas.height) //translates by OG deminsions of the image
    background.update()
    collisionBlocks.forEach(collisionBlocks => {
        collisionBlocks.update()
    })
    platformCollisionBlocks.forEach(collisionBlocks => {
        collisionBlocks.update()
    })

    player.update()

    player.velocity.x = 0
    if (keys.d.pressed) {
        player.velocity.x = 3
    } else if (keys.a.pressed){
        player.velocity.x = -3
    }

    c.restore()    

    
}

animate()

window.addEventListener('keydown', () => {
    //console.log(event)
    switch (event.key){
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
        case ' ':
            player.velocity.y = -8
            break
    }
})

window.addEventListener('keyup', () => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break        
    }
})