let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let centre = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
}


let time = 0;
let tick = 300;



class Target {
    constructor(x, y) {
        this.lives = 10000;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.color = 'red';
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
    }

    goodPosition() {
        // si la ciblle est dans la zone de jeu et pas trop proche des robots

        if (this.x > 100 && this.x < window.innerWidth - 100 && this.y > 100 && this.y < window.innerHeight - 100) {
            if (this.x > centre.x - 200 && this.x < centre.x + 200 && this.y > centre.y - 200 && this.y < centre.y + 200) {
                return false;
            }
            return true;
        }
        return false;
    }

    randomPosition() {
        while (this.goodPosition() == false) {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
        }
    }

    degats(x, y) { // x et y sont les coordonnées du centre du robot qui a touché la cible, les dégats sont accetés si le robot est assez proche de la target, rayon de 100px
        let dx = this.x - x;
        let dy = this.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 100) {
            this.lives -= 1;
        }
    }

    canDegats(x, y) { // x et y sont les coordonnées du centre du robot qui a touché la cible, les dégats sont accetés si le robot est assez proche de la target, rayon de 100px
        let dx = this.x - x;
        let dy = this.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 100) {
            return true;
        }
        return false;
    }

    allowPosition(x, y) {
        if (this.x + 20 > x && this.x - 20 < x) {
            if (this.y + 20 > y && this.y - 20 < y) {
                return { x: this.x, y: this.y }
            }
        }
        return false;
    }
}



class Robot {
    constructor(startPlace) {
        this.espace = 10;
        this.radius = 25;
        this.name = startPlace;
        this.radarRadius = 100;
        this.color = '#7B3F00';
        this.speed = 10;
        this.direction = 0;
        this.targetPosition = {
            x: null,
            y: null
        }
        this.wallDistance = {
            top: undefined,
            right: undefined,
            bottom: undefined,
            left: undefined
        }
        this.__init__ = true;

        switch (startPlace) {
            case 1:
                this.x = centre.x - this.radius * 3 - this.espace * 1.5;
                this.y = centre.y - this.radius * 2 - this.espace;
                break;
            case 2:
                this.x = centre.x - this.radius - this.espace * 0.5;
                this.y = centre.y - this.radius * 2 - this.espace;
                break;
            case 3:
                this.x = centre.x + this.radius + this.espace * 0.5;
                this.y = centre.y - this.radius * 2 - this.espace;
                break;
            case 4:
                this.x = centre.x + this.radius * 3 + this.espace * 1.5;
                this.y = centre.y - this.radius * 2 - this.espace;
                break;
            case 5:
                this.x = centre.x - this.radius * 3 - this.espace * 1.5;
                this.y = centre.y;
                break;
            case 6:
                this.x = centre.x - this.radius - this.espace * 0.5;
                this.y = centre.y;
                break;
            case 7:
                this.x = centre.x + this.radius + this.espace * 0.5;
                this.y = centre.y;
                break;
            case 8:
                this.x = centre.x + this.radius * 3 + this.espace * 1.5;
                this.y = centre.y;
                break
            case 9:
                this.x = centre.x - this.radius * 3 - this.espace * 1.5;
                this.y = centre.y + this.radius * 2 + this.espace;
                break;
            case 10:
                this.x = centre.x - this.radius - this.espace * 0.5;
                this.y = centre.y + this.radius * 2 + this.espace;
                break;
            case 11:
                this.x = centre.x + this.radius + this.espace * 0.5;
                this.y = centre.y + this.radius * 2 + this.espace;
                break;
            case 12:
                this.x = centre.x + this.radius * 3 + this.espace * 1.5;
                this.y = centre.y + this.radius * 2 + this.espace;
                break;
        }
    }

    draw() { //draw with rotate and translate
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath()
    }

    move() {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    onTarget(target) {
        if (this.x + this.radius > target.x - target.radius && this.x - this.radius < target.x + target.radius || this.x - this.radius < target.x + target.radius && this.x + this.radius > target.x - target.radius) {
            if (this.y + this.radius > target.y - target.radius && this.y < target.y + target.radius || this.y - this.radius < target.y + target.radius && this.y + this.radius > target.y - target.radius) {
                return true;
            }
        }
        return false;
    }

    detectRobot(robot) {
        if (this.radarRadius > Math.sqrt(Math.pow(this.x - robot.x, 2) + Math.pow(this.y - robot.y, 2))) {
            return true;
        }
        return false;
    }

    collideRobot(robots) {
        for (let i = 0; i < robots.length; i++) {
            const robot = robots[i];
            if (robot.name !== this.name && Math.sqrt((robot.x - this.x) ** 2 + (robot.y - this.y) ** 2) < this.radius + robot.radius) {
                return true;
            }
        }
        return false;
    }

    randomAngle() {
        this.direction = Math.random() * 2 * Math.PI;
    }

    turn(angle) {
        this.direction += angle;
    }

    outOfMap() {
        if (this.x - this.radius < 0 || this.x + this.radius > window.innerWidth || this.y - this.radius < 0 || this.y + this.radius > window.innerHeight) {
            return true;
        }
        return false;
    }


    damageTarget(target) {
        target.degats(this.x + this.width / 2, this.y + this.height / 2);
    }

    // créer une méthode pour communiquer entre robots

    sendTargetPosition(robot, x, y) {
        if (robot.name != this.name && Math.abs(this.x - robot.x) < this.radarRadius && Math.abs(this.y - robot.y) < this.radarRadius) {
            robot.receiveTargetPosition(x, y);
        }
    }

    receiveTargetPosition(x, y) {
        this.targetPosition.x = x;
        this.targetPosition.y = y;
    }

    wallPosition() {
        this.wallDistance = {
            top: this.y,
            right: window.innerWidth - this.x - this.radius,
            bottom: window.innerHeight - this.y - this.radius,
            left: this.x
        }
    }

    getData(robot) {
        let distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < this.radarRadius) {
            return {
                distance: distance,
                angle: Math.atan2(dy, dx),
                direction: robot.direction,
                speed: robot.speed,
                x: robot.x,
                y: robot.y
            }
        }
    }


    getDirection() {
        return this.direction;
    }

    getSpeed() {
        return this.speed;
    }



    algorithm(robots) {

        this.wallPosition();

        if (this.__init__) {
            this.__init__ = false;
            this.randomAngle();
        }

        // Here is the algorithm to make robots interact with each other
        // This section need to be code by a human and not written by any ia

        if (this.onTarget(target)) {
            this.damageTarget(target);
            this.targetPosition.x = target.allowPosition(this.x, this.y).x;
            this.targetPosition.y = target.allowPosition(this.x, this.y).y;
        }

        if (this.x - this.radius - 10 < 0) {
            this.direction = Math.PI - this.direction;
        }
        if (this.x + this.radius + 10 > window.innerWidth) {
            this.direction = Math.PI - this.direction;
        }
        if (this.y - this.radius - 10 < 0) {
            this.direction = 2 * Math.PI - this.direction;
        }
        if (this.y + this.radius + 10 > window.innerHeight) {
            this.direction = 2 * Math.PI - this.direction;
        }

        if (this.targetPosition.x != null && this.targetPosition.y != null) {
            let angle = Math.atan2(this.targetPosition.y - this.y, this.targetPosition.x - this.x);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            this.direction = angle;
        }
        if (this.onTarget(target)) {
            console.log('on target');
            this.targetPosition.x = target.allowPosition.x;
            this.targetPosition.y = target.allowPosition.y;
            robots.forEach(robot => {
                this.sendTargetPosition(robot, this.targetPosition.x, this.targetPosition.y);
            });
            target.degats()
        } else if (target.canDegats()) {
            console.log('can degats');
            robots.forEach(robot => {
                this.sendTargetPosition(robot, this.targetPosition.x, this.targetPosition.y);
            });
            target.degats()
        } else {
            // this.move()
        }

    }

}



let target = new Target(centre.x, centre.y);
let robots = [];
for (let i = 1; i < 3; i++) {
    robots.push(new Robot(i));
}

target.randomPosition();
target.draw();

robots.forEach(robot => {
    robot.draw();
    console.log(robot.name)
});





// update all caracters every tick
let game = setInterval(() => {
    time += 1;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    target.draw();

    // ctx.fillStyle = 'black';
    // ctx.beginPath();
    // ctx.arc(centre.x, centre.y, 3, 0, 2 * Math.PI);
    // ctx.fill();

    robots.forEach(robot => {
        // time % 200 === 0 ? console.log(robot.name + ' : ' + robot.targetPosition.x + ' ' + robot.targetPosition.y) : false;
        // time % 200 === 0 ? console.log(robot.name + ' : ' + robot.wallDistance.top + ' ' + robot.wallDistance.right + ' ' + robot.wallDistance.bottom + ' ' + robot.wallDistance.left) : false;

        robot.draw();
        if (robot.collideRobot(robots)) {
            game = clearInterval(game);
            alert('You lose in ' + time / tick + ' seconds');

        }
        if (robot.outOfMap()) {
            game = clearInterval(game);
            alert('You lose in ' + time / tick + ' seconds');
        }

        robot.algorithm(robots);
    });

    if (target.lives <= 0) {
        alert('Win in ' + time / tick + ' seconds');
    }

}, 1000 / tick);


