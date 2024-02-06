const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //c = context

canvas.width = 1024*1.3
canvas.height = 576*1.3
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
                    height: 4
                })
            )
        }
    })
})

const gravity = 0.1

const player = new Player({    
    position: {
        x: 100,
        y: 300,
    },
    collisionBlocks, // same as cB = cB
    platformCollisionBlocks,
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 15,
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 15,
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
    },
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

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)


    c.save()

    c.scale(4, 4) 
    c.translate(camera.position.x, camera.position.y) //translates by OG deminsions of the image
    background.update()
    // collisionBlocks.forEach(collisionBlocks => {collisionBlocks.update()})
    // platformCollisionBlocks.forEach(collisionBlocks => {collisionBlocks.update()})

    player.checkForHorizontalCanvasCollision()
    player.update()

    player.velocity.x = 0

    if (keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.panCameraLeft({canvas, camera})
    } else if (keys.a.pressed){
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.panCameraRight({canvas, camera})
    } else if (player.velocity.y === 0) {        
        if (player.lastDirection === 'right') player.switchSprite('Idle') 
        else player.switchSprite('IdleLeft')        
    }

    if (player.velocity.y < 0) {
        player.panCameraDown({canvas, camera})
        if (player.lastDirection === 'right') player.switchSprite('Jump') 
        else player.switchSprite('JumpLeft')
    }
    else if (player.velocity.y > 0) {
        player.panCameraUp({canvas, camera})
        if (player.lastDirection === 'right') player.switchSprite('Fall') 
        else player.switchSprite('FallLeft')
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
            if (player.velocity.y === 0) { player.jumpCounter = 2 }             
            if (player.jumpCounter > 0) {player.velocity.y = -3.5}
            player.jumpCounter--
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